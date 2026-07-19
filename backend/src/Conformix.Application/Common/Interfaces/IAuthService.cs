namespace Conformix.Application.Common.Interfaces;

public record AuthResult(string Token, string Name, string Email, string Role, string? Title, Guid TenantId);

/// <summary>Authenticates a user and issues a JWT. Implemented in Infrastructure.</summary>
public interface IAuthService
{
    Task<AuthResult?> LoginAsync(string email, string password, CancellationToken ct = default);
}
