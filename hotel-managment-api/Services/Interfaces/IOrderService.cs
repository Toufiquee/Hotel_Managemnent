using hotel_managment_api.Models;
using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public interface IOrderService
    {
        Task<List<Order>> GetAllOrders();
        Task<List<Order>> GetOrdersByEmail(string email);
        Task<Order> GetOrderById(int id);
        Task<int> AddOrder(OrderDto newOrder);
        Task<bool> UpdateOrder(int id, OrderDto updatedOrder);
        Task<bool> DeleteOrder(int id);
    }
}
