using Microsoft.AspNetCore.Mvc;
using hotel_managment_api.Services;

namespace hotel_management_api.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        
        [HttpGet("products")]
        public async Task<IActionResult> Products()
        {
            return Ok(await _productService.GetAllProducts());
        }
        
        [HttpGet("products/categories")]
        public async Task<IActionResult> GetProductCategories()
        {
            return Ok(await _productService.GetProductCategories());
        }
    }
}