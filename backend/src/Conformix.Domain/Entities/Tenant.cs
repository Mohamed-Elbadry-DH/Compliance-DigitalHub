using Conformix.Domain.Common;

namespace Conformix.Domain.Entities;

/// <summary>An organization / workspace. Every tenant-owned row references this.</summary>
public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Industry { get; set; }
    public string? Hq { get; set; }
    public int Employees { get; set; }

    public ICollection<Framework> Frameworks { get; set; } = new List<Framework>();
    public ICollection<AppUser> Users { get; set; } = new List<AppUser>();
}
