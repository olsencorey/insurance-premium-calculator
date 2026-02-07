using InsurancePremiumApi.Models;
using InsurancePremiumApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace InsurancePremiumApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PremiumController : ControllerBase
    {
        private readonly IPremiumCalculator _calculator;

        public PremiumController(IPremiumCalculator calculator)
        {
            _calculator = calculator;
        }

        [HttpPost]
        public ActionResult<PremiumResult> Calculate([FromBody] PremiumRequest request)
        {
            if (request.Age <= 0 || request.CoverageAmount <= 0)
            {
                return BadRequest("Age and Coverage Amount must be positive.");
            }

            var result = _calculator.Calculate(request);
            return Ok(result);
        }
    }
}
