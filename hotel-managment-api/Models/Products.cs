namespace hotel_managment_api.Models
{
    public class Product
    {
        public int id { get; set;}
        public string name{ get; set;} = string.Empty;
        public string description{ get; set;} = string.Empty;
        public float price{ get; set;}
        public string image{ get; set;} = string.Empty;
        public string category{ get; set;} = string.Empty;

    }
}