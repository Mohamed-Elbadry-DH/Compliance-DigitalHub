using Conformix.Domain.Common;
using Conformix.Domain.Enums;

namespace Conformix.Domain.Entities;

/// <summary>A standard/regulation/maturity model (ISO 27001, GDPR, CMMI, ...).</summary>
public class Framework : BaseEntity, ITenantOwned
{
    public Guid TenantId { get; set; }

    /// <summary>Stable slug, e.g. "iso27001".</summary>
    public string Slug { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;   // "ISO/IEC 27001:2022"
    public string Name { get; set; } = string.Empty;   // "Information Security"
    public FrameworkKind Kind { get; set; }
    public string? Color { get; set; }

    public ICollection<Control> Controls { get; set; } = new List<Control>();
}
