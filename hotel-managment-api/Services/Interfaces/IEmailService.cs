using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(OrderDto order, int orderId);
    }
}
