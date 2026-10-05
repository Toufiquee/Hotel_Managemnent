using System.ComponentModel.DataAnnotations;

namespace hotel_managment_api.Dto
{
    public class OrderDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public string Items { get; set; } = string.Empty;

        [Required]
        public float Subtotal { get; set; }

        [Required]
        public float Tax { get; set; }

        [Required]
        public float Total { get; set; }

        public string Status { get; set; } = "pending";
    }
}
