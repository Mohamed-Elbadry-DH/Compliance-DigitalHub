using Conformix.Application.Controls.Commands;
using Conformix.Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Conformix.UnitTests;

public class UpdateControlValidatorTests
{
    private readonly UpdateControlValidator _validator = new();

    [Fact]
    public void Rejects_NextReview_before_LastReview()
    {
        var cmd = new UpdateControlCommand(
            Guid.NewGuid(), ControlStatus.Compliant, "Anika",
            LastReview: new DateOnly(2026, 5, 1),
            NextReview: new DateOnly(2026, 4, 1));

        _validator.Validate(cmd).IsValid.Should().BeFalse();
    }

    [Fact]
    public void Accepts_valid_command()
    {
        var cmd = new UpdateControlCommand(
            Guid.NewGuid(), ControlStatus.InProgress, "Marcus",
            LastReview: new DateOnly(2026, 5, 1),
            NextReview: new DateOnly(2026, 8, 1));

        _validator.Validate(cmd).IsValid.Should().BeTrue();
    }
}
