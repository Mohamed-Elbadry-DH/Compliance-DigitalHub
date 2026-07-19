using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Conformix.Application.Common.Interfaces;
using Conformix.Domain.Entities;
using Conformix.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Conformix.Infrastructure.Identity;

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    private readonly PasswordHasher<AppUser> _hasher = new();

    public async Task<AuthResult?> LoginAsync(string email, string password, CancellationToken ct = default)
    {
        // Login happens before a tenant is known, so bypass the tenant query filter.
        var user = await db.AppUsers.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == email, ct);
        if (user is null) return null;

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result == PasswordVerificationResult.Failed) return null;

        var token = IssueToken(user);
        return new AuthResult(token, user.DisplayName, user.Email, user.Role, user.Title, user.TenantId);
    }

    private string IssueToken(AppUser user)
    {
        var jwt = config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            jwt["Key"] ?? "dev-only-change-me-please-32bytes-min"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("tenant_id", user.TenantId.ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"], audience: jwt["Audience"],
            claims: claims, expires: DateTime.UtcNow.AddHours(8), signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>Helper used by the seeder to hash the demo password.</summary>
    public static string HashPassword(AppUser user, string password) =>
        new PasswordHasher<AppUser>().HashPassword(user, password);
}
