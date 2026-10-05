using Microsoft.AspNetCore.Mvc;
using hotel_managment_api.Services;
using hotel_managment_api.Dto;
using Microsoft.AspNetCore.Authorization;

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

        [HttpPost("products")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProduct( [FromBody] ProductDto newProduct)
        {
            await _productService.AddProduct(newProduct);
            return Ok(new { message = "Product added successfully" });
        }

        [HttpDelete("products/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            return Ok( await _productService.DeleteProduct(id));
        }  

        // [HttpPut("products/{id}")]
        // public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto updatedProduct)
        // {
        //     // Implementation for updating a product
        //     await _productService.UpdateProduct(updatedProduct);
        //     return Ok(new { message = "Product Updated successfully" });
        // }
    }
}