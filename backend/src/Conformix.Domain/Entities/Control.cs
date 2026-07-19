using Conformix.Domain.Common;
using Conformix.Domain.Enums;

namespace Conformix.Domain.Entities;

/// <summary>The unit of compliance work within a framework.</summary>
public class Control : BaseEntity, ITenantOwned
{
    public Guid TenantId { get; set; }
    public Guid FrameworkId { get; set; }
    public Framework? Framework { get; set; }

    public string Code { get; set; } = string.Empty;   // "A.5.1"
    public string Title { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;  // "Organizational"
    public string? Owner { get; set; }
    public ControlStatus Status { get; set; } = ControlStatus.Gap;
    public DateOnly? LastReview { get; set; }
    public DateOnly? NextReview { get; set; }

    public ICollection<Evidence> Evidence { get; set; } = new List<Evidence>();
}
