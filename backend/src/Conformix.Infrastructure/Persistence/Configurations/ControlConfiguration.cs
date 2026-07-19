using Conformix.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Conformix.Infrastructure.Persistence.Configurations;

public class ControlConfiguration : IEntityTypeConfiguration<Control>
{
    public void Configure(EntityTypeBuilder<Control> b)
    {
        b.HasKey(c => c.Id);
        b.Property(c => c.Code).HasMaxLength(32).IsRequired();
        b.Property(c => c.Title).HasMaxLength(300).IsRequired();
        b.Property(c => c.Domain).HasMaxLength(120);
        b.Property(c => c.Owner).HasMaxLength(120);
        b.HasIndex(c => new { c.TenantId, c.FrameworkId, c.Code }).IsUnique();
        b.HasOne(c => c.Framework).WithMany(f => f.Controls)
            .HasForeignKey(c => c.FrameworkId).OnDelete(DeleteBehavior.Cascade);
        b.HasMany(c => c.Evidence).WithOne(e => e.Control)
            .HasForeignKey(e => e.ControlId).OnDelete(DeleteBehavior.Cascade);
    }
}
