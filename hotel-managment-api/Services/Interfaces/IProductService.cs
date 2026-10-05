using hotel_managment_api.Models;
using hotel_managment_api.Dto;
namespace hotel_managment_api.Services
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts();
        Task<List<string>> GetProductCategories();
        Task AddProduct(ProductDto newProduct);
        Task<bool> DeleteProduct(int id);
        // Task UpdateProduct(ProductDto updatedProduct);
    }
}