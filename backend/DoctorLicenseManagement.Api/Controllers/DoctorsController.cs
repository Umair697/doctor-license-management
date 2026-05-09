using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DoctorLicenseManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorsController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? status)
    {
        var doctors = await _doctorService.GetAllAsync(search, status);
        return Ok(doctors);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doctor = await _doctorService.GetByIdAsync(id);

        if (doctor is null)
            return NotFound(new { message = "Doctor not found." });

        return Ok(doctor);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDoctorDto dto)
    {
        try
        {
            var doctor = await _doctorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, doctor);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateDoctorDto dto)
    {
        try
        {
            var updated = await _doctorService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound(new { message = "Doctor not found." });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateDoctorStatusDto dto)
    {
        var updated = await _doctorService.UpdateStatusAsync(id, dto);

        if (!updated)
            return NotFound(new { message = "Doctor not found." });

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _doctorService.DeleteAsync(id);

        if (!deleted)
            return NotFound(new { message = "Doctor not found." });

        return NoContent();
    }

    [HttpGet("expired")]
    public async Task<IActionResult> GetExpiredDoctors()
    {
        var doctors = await _doctorService.GetExpiredDoctorsAsync();
        return Ok(doctors);
    }
}