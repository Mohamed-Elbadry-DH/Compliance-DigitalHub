using Conformix.Application.Common.Interfaces;
using Conformix.Domain.Common;
using Conformix.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Conformix.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUser currentUser)
    : DbContext(options), IAppDbContext
{
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Framework> Frameworks => Set<Framework>();
    public DbSet<Control> Controls => Set<Control>();
    public DbSet<Evidence> Evidence => Set<Evidence>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // ── Tenant isolation ─────────────────────────────────────────────
        // Every ITenantOwned entity is automatically filtered to the caller's
        // tenant. A developer cannot forget this; it is applied model-wide.
        b.Entity<Framework>().HasQueryFilter(e => e.TenantId == currentUser.TenantId);
        b.Entity<Control>().HasQueryFilter(e => e.TenantId == currentUser.TenantId);
        b.Entity<Evidence>().HasQueryFilter(e => e.TenantId == currentUser.TenantId);
        b.Entity<AppUser>().HasQueryFilter(e => e.TenantId == currentUser.TenantId);
        b.Entity<ActivityLog>().HasQueryFilter(e => e.TenantId == currentUser.TenantId);
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.CreatedBy = currentUser.Email;
                if (entry.Entity is ITenantOwned owned && owned.TenantId == Guid.Empty)
                    owned.TenantId = currentUser.TenantId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
                entry.Entity.UpdatedBy = currentUser.Email;
            }
        }
        return base.SaveChangesAsync(ct);
    }
}
