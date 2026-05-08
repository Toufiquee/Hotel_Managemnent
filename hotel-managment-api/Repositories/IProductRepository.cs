using hotel_managment_api.Models;
namespace hotel_managment_api.Repositories
{
    public interface IProductRepository
    {
        Task<List<Product>> GetProductsAsync();
        Task<List<Product>> GetProductCategoriesAsync();
    }
} 