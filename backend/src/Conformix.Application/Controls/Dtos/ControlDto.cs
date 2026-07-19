using Conformix.Domain.Enums;

namespace Conformix.Application.Controls.Dtos;

public record ControlDto(
    Guid Id,
    Guid FrameworkId,
    string FrameworkSlug,
    string Code,
    string Title,
    string Domain,
    string? Owner,
    ControlStatus Status,
    DateOnly? LastReview,
    DateOnly? NextReview,
    int EvidenceCount);
