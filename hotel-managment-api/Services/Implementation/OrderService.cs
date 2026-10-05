using hotel_managment_api.Repositories;
using hotel_managment_api.Models;
using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IEmailService _emailService;

        public OrderService(IOrderRepository orderRepository, IEmailService emailService)
        {
            _orderRepository = orderRepository;
            _emailService = emailService;
        }

        public Task<List<Order>> GetAllOrders()
        {
            return _orderRepository.GetAllOrdersAsync();
        }

        public Task<List<Order>> GetOrdersByEmail(string email)
        {
            return _orderRepository.GetOrdersByEmailAsync(email);
        }

        public Task<Order> GetOrderById(int id)
        {
            return _orderRepository.GetOrderByIdAsync(id);
        }

        public async Task<int> AddOrder(OrderDto newOrder)
        {
            var orderModel = new Order
            {
                name = newOrder.Name,
                email = newOrder.Email,
                phone = newOrder.Phone,
                address = newOrder.Address,
                city = newOrder.City,
                zipCode = newOrder.ZipCode,
                paymentMethod = newOrder.PaymentMethod,
                items = newOrder.Items,
                subtotal = newOrder.Subtotal,
                tax = newOrder.Tax,
                total = newOrder.Total,
                status = newOrder.Status
            };

            var orderId = await _orderRepository.AddOrderAsync(orderModel);
            if (orderId > 0)
            {
                await _emailService.SendOrderConfirmationAsync(newOrder, orderId);
            }

            return orderId;
        }

        public Task<bool> UpdateOrder(int id, OrderDto updatedOrder)
        {
            var orderModel = new Order
            {
                id = id,
                name = updatedOrder.Name,
                email = updatedOrder.Email,
                phone = updatedOrder.Phone,
                address = updatedOrder.Address,
                city = updatedOrder.City,
                zipCode = updatedOrder.ZipCode,
                paymentMethod = updatedOrder.PaymentMethod,
                items = updatedOrder.Items,
                subtotal = updatedOrder.Subtotal,
                tax = updatedOrder.Tax,
                total = updatedOrder.Total,
                status = updatedOrder.Status
            };
            return _orderRepository.UpdateOrderAsync(orderModel);
        }

        public Task<bool> DeleteOrder(int id)
        {
            return _orderRepository.DeleteOrderAsync(id);
        }
    }
}
