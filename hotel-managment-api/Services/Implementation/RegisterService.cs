using hotel_managment_api.Repositories;
using hotel_managment_api.Models;
using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly IUserRepository _userRepository;

        public RegisterService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> RegisterAsync(RegisterDto model)
        {
            // 🔍 Check if email exists
            var existingUser = await _userRepository.GetByEmailAsync(model.Email);

            if (existingUser != null)
            {
                return "Email already exists";
            }

            // 🔐 Hash password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new Models.User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = hashedPassword,
                Gender = model.Gender
            };

            // 💾 Save user
            await _userRepository.AddUserAsync(user);

            return "User registered successfully";
        }
    }
}