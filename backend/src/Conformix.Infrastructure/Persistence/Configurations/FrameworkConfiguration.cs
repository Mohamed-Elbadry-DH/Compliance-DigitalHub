using Conformix.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Conformix.Infrastructure.Persistence.Configurations;

public class FrameworkConfiguration : IEntityTypeConfiguration<Framework>
{
    public void Configure(EntityTypeBuilder<Framework> b)
    {
        b.HasKey(f => f.Id);
        b.Property(f => f.Slug).HasMaxLength(40).IsRequired();
        b.Property(f => f.Code).HasMaxLength(80).IsRequired();
        b.Property(f => f.Name).HasMaxLength(160).IsRequired();
        b.HasIndex(f => new { f.TenantId, f.Slug }).IsUnique();
    }
}
