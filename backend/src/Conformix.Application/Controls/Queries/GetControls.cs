using Conformix.Application.Common.Interfaces;
using Conformix.Application.Controls.Dtos;
using Conformix.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Conformix.Application.Controls.Queries;

public record GetControlsQuery(string? FrameworkSlug, ControlStatus? Status);

public class GetControlsHandler(IAppDbContext db)
{
    public async Task<IReadOnlyList<ControlDto>> Handle(GetControlsQuery q, CancellationToken ct = default)
    {
        // Tenant isolation is applied automatically by a global query filter in the DbContext.
        var query = db.Controls.Include(c => c.Framework).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.FrameworkSlug))
            query = query.Where(c => c.Framework!.Slug == q.FrameworkSlug);
        if (q.Status is not null)
            query = query.Where(c => c.Status == q.Status);

        return await query
            .OrderBy(c => c.Framework!.Slug).ThenBy(c => c.Code)
            .Select(c => new ControlDto(
                c.Id, c.FrameworkId, c.Framework!.Slug, c.Code, c.Title, c.Domain,
                c.Owner, c.Status, c.LastReview, c.NextReview, c.Evidence.Count))
            .ToListAsync(ct);
    }
}
