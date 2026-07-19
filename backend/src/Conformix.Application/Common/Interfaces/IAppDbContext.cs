using Conformix.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conformix.Application.Common.Interfaces;

/// <summary>Abstraction over the DbContext so Application stays framework-light.</summary>
public interface IAppDbContext
{
    DbSet<Framework> Frameworks { get; }
    DbSet<Control> Controls { get; }
    DbSet<Evidence> Evidence { get; }
    DbSet<ActivityLog> ActivityLogs { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
