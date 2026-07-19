using Conformix.Domain.Common;

namespace Conformix.Domain.Entities;

/// <summary>Immutable audit trail — a compliance requirement in its own right.</summary>
public class ActivityLog : BaseEntity, ITenantOwned
{
    public Guid TenantId { get; set; }
    public string Actor { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;   // "Control.Updated"
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? Summary { get; set; }
}
