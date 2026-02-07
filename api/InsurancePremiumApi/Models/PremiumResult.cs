namespace InsurancePremiumApi.Models
{
    public class PremiumResult
    {
        public decimal AnnualPremium { get; set; }
        public decimal BaseRate { get; set; }
        public decimal AgeFactor { get; set; }
        public decimal SmokerSurcharge { get; set; }
        public decimal StateAdjustment { get; set; }
        public string RatingNotes { get; set; } = string.Empty;
    }
}
