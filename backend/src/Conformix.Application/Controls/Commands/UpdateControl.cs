using Conformix.Application.Common.Interfaces;
using Conformix.Domain.Entities;
using Conformix.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Conformix.Application.Controls.Commands;

public record UpdateControlCommand(
    Guid Id,
    ControlStatus Status,
    string? Owner,
    DateOnly? LastReview,
    DateOnly? NextReview);

public class UpdateControlValidator : AbstractValidator<UpdateControlCommand>
{
    public UpdateControlValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Owner).MaximumLength(120);
        RuleFor(x => x)
            .Must(x => x.NextReview is null || x.LastReview is null || x.NextReview >= x.LastReview)
            .WithMessage("NextReview must be on or after LastReview.");
    }
}

public class UpdateControlHandler(IAppDbContext db, ICurrentUser user)
{
    public async Task Handle(UpdateControlCommand cmd, CancellationToken ct = default)
    {
        var control = await db.Controls.FirstOrDefaultAsync(c => c.Id == cmd.Id, ct)
            ?? throw new KeyNotFoundException($"Control {cmd.Id} not found.");

        control.Status = cmd.Status;
        control.Owner = cmd.Owner;
        control.LastReview = cmd.LastReview;
        control.NextReview = cmd.NextReview;

        db.ActivityLogs.Add(new ActivityLog
        {
            TenantId = user.TenantId,
            Actor = user.Email,
            Action = "Control.Updated",
            EntityType = nameof(Control),
            EntityId = control.Id.ToString(),
            Summary = $"Status set to {cmd.Status}"
        });

        await db.SaveChangesAsync(ct);
    }
}
