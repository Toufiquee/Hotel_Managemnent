using Stripe;
using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;

        public PaymentService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<CreatePaymentOrderResponse> CreateOrderAsync(CreatePaymentOrderRequest request)
        {
            var secretKey = _configuration["Stripe:SecretKey"]
                ?? throw new InvalidOperationException("Stripe SecretKey is not configured.");
            var publishableKey = _configuration["Stripe:PublishableKey"]
                ?? throw new InvalidOperationException("Stripe PublishableKey is not configured.");

            StripeConfiguration.ApiKey = secretKey;

            var amountInSmallestUnit = (long)Math.Round(request.Amount * 100, MidpointRounding.AwayFromZero);
            if (amountInSmallestUnit < 50)
                throw new ArgumentException("Amount must be at least 0.50 in the selected currency.");

            var currency = request.Currency.ToLowerInvariant();
            var options = new PaymentIntentCreateOptions
            {
                Amount = amountInSmallestUnit,
                Currency = currency,
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true
                },
                Metadata = new Dictionary<string, string>
                {
                    ["receipt"] = request.Receipt ?? $"rcpt_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}"
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return new CreatePaymentOrderResponse
            {
                ClientSecret = paymentIntent.ClientSecret
                    ?? throw new InvalidOperationException("Stripe client secret missing in response."),
                PublishableKey = publishableKey,
                PaymentIntentId = paymentIntent.Id,
                Amount = request.Amount,
                Currency = currency
            };
        }

        public async Task<VerifyPaymentResponse> VerifyPaymentAsync(VerifyPaymentRequest request)
        {
            var secretKey = _configuration["Stripe:SecretKey"]
                ?? throw new InvalidOperationException("Stripe SecretKey is not configured.");

            StripeConfiguration.ApiKey = secretKey;

            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(request.PaymentIntentId);

            if (paymentIntent.Status == "succeeded")
            {
                return new VerifyPaymentResponse
                {
                    Success = true,
                    Message = "Payment verified successfully."
                };
            }

            return new VerifyPaymentResponse
            {
                Success = false,
                Message = $"Payment not completed. Status: {paymentIntent.Status}."
            };
        }
    }
}
