using Microsoft.AspNetCore.Mvc;
using hotel_managment_api.Services;
using hotel_managment_api.Dto;
using Microsoft.EntityFrameworkCore;
using hotel_managment_api.Models;
using hotel_managment_api.Data;
using BCrypt.Net;

namespace hotel_managment_api.Controllers
{
    [ApiController]
    [Route("api")]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterService _registerService;
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public RegisterController(IRegisterService registerService, AppDbContext context, JwtService jwtService)
        {
            _registerService = registerService;
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var result = await _registerService.RegisterAsync(model);

            return Ok(new { message = result });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequestDto request)
        {
            var user = _context.Users
                       .FirstOrDefault(x => x.Email == request.Email);

            if (user == null)
            {
              return Unauthorized("Invalid email or password.");
            }

    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
        request.Password,
        user.PasswordHash);

    if (!isPasswordValid)
    {
        return Unauthorized("Invalid email or password.");
    }

    var token = _jwtService.GenerateToken(user);

    return Ok(new
    {
        Token = token,
        User = new
        {
            user.Id,
            user.Name,
            user.Email,
            user.Role
        }
    });
}
    }
}
