using Microsoft.AspNetCore.Mvc;
using hotel_managment_api.Services;
using hotel_managment_api.Dto;

namespace hotel_managment_api.Controllers
{
    [ApiController]
    [Route("api")]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterService _registerService;

        public RegisterController(IRegisterService registerService)
        {
            _registerService = registerService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var result = await _registerService.RegisterAsync(model);

            return Ok(new { message = result });
        }
    }
}
