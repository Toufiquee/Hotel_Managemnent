using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public interface IPaymentService
    {
        Task<CreatePaymentOrderResponse> CreateOrderAsync(CreatePaymentOrderRequest request);
        Task<VerifyPaymentResponse> VerifyPaymentAsync(VerifyPaymentRequest request);
    }
}
