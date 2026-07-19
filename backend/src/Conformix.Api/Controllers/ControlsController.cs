using Conformix.Application.Controls.Commands;
using Conformix.Application.Controls.Dtos;
using Conformix.Application.Controls.Queries;
using Conformix.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Conformix.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ControlsController(GetControlsHandler getControls, UpdateControlHandler updateControl)
    : ControllerBase
{
    /// <summary>List controls for the caller's tenant, optionally filtered.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ControlDto>>> Get(
        [FromQuery] string? framework, [FromQuery] ControlStatus? status, CancellationToken ct)
        => Ok(await getControls.Handle(new GetControlsQuery(framework, status), ct));

    /// <summary>Update a control (status, owner, review dates). Writes an audit log entry.</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,ComplianceOfficer")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateControlCommand body, CancellationToken ct)
    {
        if (id != body.Id) return BadRequest("Route id and body id differ.");
        await updateControl.Handle(body, ct);
        return NoContent();
    }
}
