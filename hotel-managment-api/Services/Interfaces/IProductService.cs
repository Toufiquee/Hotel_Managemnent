using hotel_managment_api.Models;
namespace hotel_managment_api.Services
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts();
        Task<List<Product>> GetProductCategories();
    }
}