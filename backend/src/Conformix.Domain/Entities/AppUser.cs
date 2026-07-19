using Conformix.Domain.Common;

namespace Conformix.Domain.Entities;

/// <summary>Domain view of a user. Identity credentials live in Infrastructure.</summary>
public class AppUser : BaseEntity, ITenantOwned
{
    public Guid TenantId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Role { get; set; } = "DepartmentLead"; // Admin/ComplianceOfficer/DepartmentLead/Auditor/Executive
    public string PasswordHash { get; set; } = string.Empty;
    public string? Title { get; set; }
}
