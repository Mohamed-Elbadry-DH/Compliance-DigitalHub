namespace Conformix.Application.Common.Interfaces;

/// <summary>Object storage seam — MinIO on-prem today, S3 later, same interface.</summary>
public interface IFileStorage
{
    Task<string> SaveAsync(string key, Stream content, string contentType, CancellationToken ct = default);
    Task<Stream> OpenAsync(string key, CancellationToken ct = default);
    Task DeleteAsync(string key, CancellationToken ct = default);
}
