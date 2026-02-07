namespace InsurancePremiumApi.Models
{
    public class PremiumRequest
    {
        public int Age { get; set; }
        public decimal CoverageAmount { get; set; }
        public bool IsSmoker { get; set; }
        public string State { get; set; } = "PA";
    }
}
