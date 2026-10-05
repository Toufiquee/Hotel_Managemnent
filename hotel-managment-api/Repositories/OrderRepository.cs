using hotel_managment_api.Data;
using hotel_managment_api.Models;
using Microsoft.EntityFrameworkCore;

namespace hotel_managment_api.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        public AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders.OrderByDescending(o => o.orderDate).ToListAsync();
        }

        public async Task<List<Order>> GetOrdersByEmailAsync(string email)
        {
            return await _context.Orders.Where(o => o.email == email).OrderByDescending(o => o.orderDate).ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        public async Task<int> AddOrderAsync(Order newOrder)
        {
            try
            {
                newOrder.orderDate = DateTime.Now;
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();
                return newOrder.id;
            }
            catch
            {
                return 0;
            }
        }

        public async Task<bool> UpdateOrderAsync(Order updatedOrder)
        {
            try
            {
                var order = await _context.Orders.FindAsync(updatedOrder.id);
                if (order == null)
                    return false;

                order.status = updatedOrder.status;
                order.items = updatedOrder.items;
                order.total = updatedOrder.total;
                order.tax = updatedOrder.tax;
                order.subtotal = updatedOrder.subtotal;

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                    return false;

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
