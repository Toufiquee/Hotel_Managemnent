namespace hotel_managment_api.Models
{
    public class Order
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string phone { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public string city { get; set; } = string.Empty;
        public string zipCode { get; set; } = string.Empty;
        public string paymentMethod { get; set; } = string.Empty;
        public string items { get; set; } = string.Empty; // JSON string of items
        public float subtotal { get; set; }
        public float tax { get; set; }
        public float total { get; set; }
        public string status { get; set; } = "pending"; // pending, completed, cancelled
        public DateTime orderDate { get; set; }
    }
}
