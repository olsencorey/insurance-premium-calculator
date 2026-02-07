using InsurancePremiumApi.Models;

namespace InsurancePremiumApi.Services
{
    public interface IPremiumCalculator
    {
        PremiumResult Calculate(PremiumRequest request);
    }

    public class PremiumCalculator : IPremiumCalculator
    {
        public PremiumResult Calculate(PremiumRequest request)
        {
            decimal baseRate = 0.02m; // 2% of coverage
            decimal ageFactor = request.Age < 30 ? 0.9m :
                                request.Age < 50 ? 1.1m :
                                1.4m;

            decimal smokerSurcharge = request.IsSmoker ? 0.5m : 0m; // +50% if smoker

            decimal stateAdjustment = request.State switch
            {
                "CA" => 1.1m,
                "NY" => 1.15m,
                _ => 1.0m
            };

            decimal basePremium = request.CoverageAmount * baseRate;
            decimal adjusted = basePremium * ageFactor * stateAdjustment;
            decimal finalPremium = adjusted * (1 + smokerSurcharge);

            return new PremiumResult
            {
                AnnualPremium = decimal.Round(finalPremium, 2),
                BaseRate = baseRate,
                AgeFactor = ageFactor,
                SmokerSurcharge = smokerSurcharge,
                StateAdjustment = stateAdjustment,
                RatingNotes = $"Age band applied. State={request.State}, smoker={request.IsSmoker}."
            };
        }
    }
}
