using System.ComponentModel.DataAnnotations;

namespace hotel_managment_api.Dto
{
    public class CreatePaymentOrderRequest
    {
        [Required]
        [Range(1, double.MaxValue)]
        public decimal Amount { get; set; }

        public string Currency { get; set; } = "usd";

        public string? Receipt { get; set; }
    }

    public class CreatePaymentOrderResponse
    {
        public string ClientSecret { get; set; } = string.Empty;
        public string PublishableKey { get; set; } = string.Empty;
        public string PaymentIntentId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "usd";
    }

    public class VerifyPaymentRequest
    {
        [Required]
        public string PaymentIntentId { get; set; } = string.Empty;
    }

    public class VerifyPaymentResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
