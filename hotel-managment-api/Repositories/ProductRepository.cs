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

        public async Task<List<Product>> GetProductCategoriesAsync()
        {
            return await _context.Products.Select(p => p.Category).Distinct().ToListAsync();
        }
   }
}