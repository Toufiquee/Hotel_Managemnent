using hotel_managment_api.Models;
namespace hotel_managment_api.Repositories
{
    public interface IProductRepository
    {
        Task<List<Product>> GetProductsAsync();
        Task<List<string>> GetProductCategoriesAsync();
        Task<bool> DeleteProductAsync(int id);
        Task AddProductAsync(Product newProduct);
    }
} 