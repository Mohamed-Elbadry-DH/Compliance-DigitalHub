namespace Conformix.Domain.Common;

/// <summary>Base for all persisted entities. Auditing fields are set by the DbContext.</summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}

/// <summary>Marks an entity as owned by a tenant. A global query filter enforces isolation.</summary>
public interface ITenantOwned
{
    Guid TenantId { get; set; }
}
