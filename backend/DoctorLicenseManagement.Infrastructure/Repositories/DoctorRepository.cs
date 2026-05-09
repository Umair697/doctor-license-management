using System.Data;
using Dapper;
using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Application.Interfaces;
using DoctorLicenseManagement.Domain.Entities;
using DoctorLicenseManagement.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DoctorLicenseManagement.Infrastructure.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public DoctorRepository(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<List<DoctorDto>> GetAllAsync(string? search, string? status)
    {
        using var connection = new SqlConnection(
            _configuration.GetConnectionString("DefaultConnection")
        );

        var parameters = new DynamicParameters();
        parameters.Add("@Search", search);
        parameters.Add("@Status", status);

        var doctors = await connection.QueryAsync<DoctorDto>(
            "sp_GetDoctors",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return doctors.ToList();
    }

    public async Task<Doctor?> GetByIdAsync(int id)
    {
        return await _context.Doctors
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<bool> LicenseNumberExistsAsync(string licenseNumber, int? excludeDoctorId = null)
    {
        return await _context.Doctors.AnyAsync(x =>
            x.LicenseNumber == licenseNumber &&
            !x.IsDeleted &&
            (!excludeDoctorId.HasValue || x.Id != excludeDoctorId.Value)
        );
    }

    public async Task AddAsync(Doctor doctor)
    {
        await _context.Doctors.AddAsync(doctor);
    }

    public Task UpdateAsync(Doctor doctor)
    {
        _context.Doctors.Update(doctor);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
    public async Task<List<DoctorDto>> GetExpiredDoctorsAsync()
    {
        using var connection = new SqlConnection(
            _configuration.GetConnectionString("DefaultConnection")
        );

        var doctors = await connection.QueryAsync<DoctorDto>(
            "sp_GetExpiredDoctors",
            commandType: CommandType.StoredProcedure
        );

        return doctors.ToList();
    }
}