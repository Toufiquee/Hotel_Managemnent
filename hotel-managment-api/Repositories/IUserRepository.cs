using hotel_managment_api.Models;

namespace hotel_managment_api.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
    }
}