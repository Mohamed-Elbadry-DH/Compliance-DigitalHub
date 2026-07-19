namespace Conformix.Application.Common.Interfaces;

/// <summary>Resolves the caller + their tenant from the request (JWT claims).</summary>
public interface ICurrentUser
{
    Guid TenantId { get; }
    string UserId { get; }
    string Email { get; }
    string Role { get; }
    bool IsAuthenticated { get; }
}
