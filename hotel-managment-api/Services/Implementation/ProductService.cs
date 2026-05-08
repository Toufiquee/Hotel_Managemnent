using hotel_managment_api.Repositories;
using hotel_managment_api.Models;

namespace hotel_managment_api.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        
        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }
        
        public Task<List<Product>> GetAllProducts()
        {
            return _productRepository.GetProductsAsync();
        }

        public Task<List<Product>> GetProductCategories()
        {
            return _productRepository.GetProductCategoriesAsync();
        }
    }
}