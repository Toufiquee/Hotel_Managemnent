using hotel_managment_api.Repositories;
using hotel_managment_api.Models;
using hotel_managment_api.Dto;

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

        public Task<List<string>> GetProductCategories()
        {
            return _productRepository.GetProductCategoriesAsync();
        }

        public Task<bool> DeleteProduct(int id)
        {
            return _productRepository.DeleteProductAsync(id);
        }

        public Task AddProduct(ProductDto newProduct)
        {
            var productModel = new Product
            {
                name = newProduct.Name,
                description = newProduct.Description,
                price = (float)newProduct.Price,
                image = newProduct.Image,
                category = newProduct.Category
            };
            return _productRepository.AddProductAsync(productModel);
        }

        // public async Task UpdateProduct(ProductDto updatedProduct)
        // {
        //     var productModel = new Product
        //     {
        //         // id = updatedProduct.Id,
        //         name = updatedProduct.Name,
        //         description = updatedProduct.Description,
        //         price = (float)updatedProduct.Price,
        //         image = updatedProduct.Image,
        //         category = updatedProduct.Category
        //     };
        //     await _productRepository.UpdateProductAsync(productModel);
        // }
    }
}