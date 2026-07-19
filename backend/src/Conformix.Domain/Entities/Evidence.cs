using Conformix.Domain.Common;
using Conformix.Domain.Enums;

namespace Conformix.Domain.Entities;

/// <summary>A stored file tagged to a control, with expiration tracking.</summary>
public class Evidence : BaseEntity, ITenantOwned
{
    public Guid TenantId { get; set; }
    public Guid ControlId { get; set; }
    public Control? Control { get; set; }

    public string FileName { get; set; } = string.Empty;
    public string StorageKey { get; set; } = string.Empty; // object-store key (MinIO/S3)
    public long SizeBytes { get; set; }
    public string ContentType { get; set; } = "application/octet-stream";
    public DateOnly? ExpiresOn { get; set; }
    public EvidenceState State { get; set; } = EvidenceState.Valid;
}
