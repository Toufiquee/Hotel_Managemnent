using hotel_managment_api.Data;
using hotel_managment_api.Models;
using Microsoft.EntityFrameworkCore;


namespace hotel_managment_api.Repositories
{
    public class ProductRepository : IProductRepository
    {
        public AppDbContext _context;
        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }
        
        public async Task<List<Product>> GetProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<List<string>> GetProductCategoriesAsync()
        {
            return await _context.Products.Select(p => p.category).Distinct().ToListAsync();
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product == null) return false;
            
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task AddProductAsync(Product newProduct)
        {
            var product = new Product
            {
                name = newProduct.name,
                description = newProduct.description,
                price = newProduct.price,
                category = newProduct.category,
                image = newProduct.image
            };
            
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }
    
   }
}