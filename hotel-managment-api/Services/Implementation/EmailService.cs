using System.Net;
using System.Net.Mail;
using hotel_managment_api.Dto;
using hotel_managment_api.Services;

namespace hotel_managment_api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOrderConfirmationAsync(OrderDto order, int orderId)
        {
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPort = _configuration["Smtp:Port"];
            var smtpUser = _configuration["Smtp:User"];
            var smtpPassword = _configuration["Smtp:Password"];
            var fromEmail = _configuration["Smtp:From"];

            if (string.IsNullOrWhiteSpace(smtpHost) || string.IsNullOrWhiteSpace(smtpUser) || string.IsNullOrWhiteSpace(smtpPassword) || string.IsNullOrWhiteSpace(fromEmail))
            {
                return;
            }

            var subject = "Thank you for your order!";
            var body = $@"
                <h2>Thank you for your order!</h2>
                <p>Your order has been received successfully.</p>
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Name:</strong> {order.Name}</p>
                <p><strong>Email:</strong> {order.Email}</p>
                <p><strong>Phone:</strong> {order.Phone}</p>
                <p><strong>Address:</strong> {order.Address}, {order.City}, {order.ZipCode}</p>
                <p><strong>Payment Method:</strong> {order.PaymentMethod}</p>
                <p><strong>Items:</strong> {order.Items}</p>
                <p><strong>Subtotal:</strong> {order.Subtotal:C}</p>
                <p><strong>Tax:</strong> {order.Tax:C}</p>
                <p><strong>Total:</strong> {order.Total:C}</p>
                <p>We will process your order shortly.</p>
            ";

            using var smtpClient = new SmtpClient(smtpHost)
            {
                Port = int.TryParse(smtpPort, out var port) ? port : 587,
                Credentials = new NetworkCredential(smtpUser, smtpPassword),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(order.Email);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
