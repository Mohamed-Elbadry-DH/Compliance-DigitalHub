using System.Text.Json;
using Conformix.Domain.Entities;
using Conformix.Domain.Enums;
using Conformix.Infrastructure.Identity;

namespace Conformix.Infrastructure.Persistence;

/// <summary>
/// Seeds the Digital Hub demo tenant (company, frameworks, controls, users)
/// from digitalhub.json. Idempotent: does nothing if data already exists.
/// All seven users share the demo password below.
/// </summary>
public static class DemoDataSeeder
{
    public const string DemoPassword = "Demo123!";

    public static async Task SeedAsync(AppDbContext db, string jsonPath, CancellationToken ct = default)
    {
        if (db.Tenants.Any()) return;                       // already seeded
        if (!File.Exists(jsonPath)) return;                 // no seed file → skip quietly

        using var doc = JsonDocument.Parse(await File.ReadAllTextAsync(jsonPath, ct));
        var root = doc.RootElement;

        var companyEl = root.GetProperty("company");
        var tenant = new Tenant
        {
            Name = companyEl.GetProperty("name").GetString()!,
            Industry = companyEl.GetProperty("industry").GetString(),
            Hq = companyEl.GetProperty("hq").GetString(),
            Employees = companyEl.GetProperty("employees").GetInt32(),
        };
        db.Tenants.Add(tenant);

        // Frameworks (keyed by slug so controls can link back)
        var bySlug = new Dictionary<string, Framework>();
        foreach (var f in root.GetProperty("frameworks").EnumerateArray())
        {
            var fw = new Framework
            {
                TenantId = tenant.Id,
                Slug = f.GetProperty("slug").GetString()!,
                Code = f.GetProperty("code").GetString()!,
                Name = f.GetProperty("name").GetString()!,
                Kind = Enum.Parse<FrameworkKind>(f.GetProperty("kind").GetString()!),
                Color = f.GetProperty("color").GetString(),
            };
            bySlug[fw.Slug] = fw;
            db.Frameworks.Add(fw);
        }

        // Controls
        foreach (var c in root.GetProperty("controls").EnumerateArray())
        {
            var slug = c.GetProperty("framework").GetString()!;
            if (!bySlug.TryGetValue(slug, out var fw)) continue;
            db.Controls.Add(new Control
            {
                TenantId = tenant.Id,
                FrameworkId = fw.Id,
                Code = c.GetProperty("code").GetString()!,
                Title = c.GetProperty("title").GetString()!,
                Domain = c.GetProperty("domain").GetString() ?? string.Empty,
                Owner = c.TryGetProperty("owner", out var o) ? o.GetString() : null,
                Status = Enum.Parse<ControlStatus>(c.GetProperty("status").GetString()!),
                LastReview = ParseDate(c, "lastReview"),
                NextReview = ParseDate(c, "nextReview"),
            });
        }

        // Users (all share the demo password)
        foreach (var u in root.GetProperty("users").EnumerateArray())
        {
            var user = new AppUser
            {
                TenantId = tenant.Id,
                Email = u.GetProperty("email").GetString()!,
                DisplayName = u.GetProperty("name").GetString()!,
                Role = u.GetProperty("role").GetString()!,
                Title = u.TryGetProperty("title", out var t) ? t.GetString() : null,
            };
            user.PasswordHash = AuthService.HashPassword(user, DemoPassword);
            db.AppUsers.Add(user);
        }

        await db.SaveChangesAsync(ct);
    }

    private static DateOnly? ParseDate(JsonElement el, string prop) =>
        el.TryGetProperty(prop, out var v) && v.ValueKind == JsonValueKind.String
            ? DateOnly.Parse(v.GetString()!)
            : null;
}
