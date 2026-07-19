using Conformix.Application.Common.Interfaces;
using Minio;
using Minio.DataModel.Args;

namespace Conformix.Infrastructure.Storage;

/// <summary>S3-compatible object storage (MinIO on-prem, or any S3 later).</summary>
public class MinioFileStorage(IMinioClient client, string bucket) : IFileStorage
{
    public async Task<string> SaveAsync(string key, Stream content, string contentType, CancellationToken ct = default)
    {
        content.Seek(0, SeekOrigin.Begin);
        await client.PutObjectAsync(new PutObjectArgs()
            .WithBucket(bucket).WithObject(key)
            .WithStreamData(content).WithObjectSize(content.Length)
            .WithContentType(contentType), ct);
        return key;
    }

    public async Task<Stream> OpenAsync(string key, CancellationToken ct = default)
    {
        var ms = new MemoryStream();
        await client.GetObjectAsync(new GetObjectArgs()
            .WithBucket(bucket).WithObject(key)
            .WithCallbackStream(s => s.CopyTo(ms)), ct);
        ms.Seek(0, SeekOrigin.Begin);
        return ms;
    }

    public Task DeleteAsync(string key, CancellationToken ct = default) =>
        client.RemoveObjectAsync(new RemoveObjectArgs().WithBucket(bucket).WithObject(key), ct);
}
