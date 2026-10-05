using Microsoft.AspNetCore.Mvc;
using hotel_managment_api.Services;
using hotel_managment_api.Dto;

namespace hotel_managment_api.Controllers
{
    [ApiController]
    [Route("api")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrders();
            return Ok(orders);
        }

        [HttpGet("orders/email/{email}")]
        public async Task<IActionResult> GetOrdersByEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest(new { message = "Email is required" });
            
            var orders = await _orderService.GetOrdersByEmail(email);
            return Ok(orders);
        }

        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderById(id);
            if (order == null)
                return NotFound(new { message = "Order not found" });
            return Ok(order);
        }

        [HttpPost("orders")]
        public async Task<IActionResult> AddOrder([FromBody] OrderDto newOrder)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var orderId = await _orderService.AddOrder(newOrder);
            if (orderId == 0)
                return BadRequest(new { message = "Failed to create order" });
            
            return Ok(new { message = "Order created successfully", orderId = orderId });
        }

        [HttpPut("orders/{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDto updatedOrder)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _orderService.UpdateOrder(id, updatedOrder);
            if (!result)
                return BadRequest(new { message = "Failed to update order" });
            return Ok(new { message = "Order updated successfully" });
        }

        [HttpDelete("orders/{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var result = await _orderService.DeleteOrder(id);
            if (!result)
                return BadRequest(new { message = "Failed to delete order" });
            return Ok(new { message = "Order deleted successfully" });
        }
    }
}
