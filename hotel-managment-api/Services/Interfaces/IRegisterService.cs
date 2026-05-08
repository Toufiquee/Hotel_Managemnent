using hotel_managment_api.Dto;

namespace hotel_managment_api.Services
{
    public interface IRegisterService
    {
        Task<string> RegisterAsync(RegisterDto model);
    }
}