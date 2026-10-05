using hotel_managment_api.Models;

namespace hotel_managment_api.Repositories
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetAllOrdersAsync();
        Task<List<Order>> GetOrdersByEmailAsync(string email);
        Task<Order> GetOrderByIdAsync(int id);
        Task<int> AddOrderAsync(Order newOrder);
        Task<bool> UpdateOrderAsync(Order updatedOrder);
        Task<bool> DeleteOrderAsync(int id);
    }
}
