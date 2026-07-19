using System.Security.Claims;
using Conformix.Application.Common.Interfaces;

namespace Conformix.Api;

/// <summary>Reads the caller + tenant from JWT claims on each request.</summary>
public class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    private ClaimsPrincipal? User => accessor.HttpContext?.User;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
    public string UserId => User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    public string Email => User?.FindFirstValue(ClaimTypes.Email) ?? "system@conformix";
    public string Role => User?.FindFirstValue(ClaimTypes.Role) ?? "Anonymous";

    public Guid TenantId =>
        Guid.TryParse(User?.FindFirstValue("tenant_id"), out var id) ? id : Guid.Empty;
}
