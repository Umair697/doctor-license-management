using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Domain.Entities;

namespace DoctorLicenseManagement.Application.Interfaces;

public interface IDoctorRepository
{
    Task<List<DoctorDto>> GetAllAsync(string? search, string? status);
    Task<Doctor?> GetByIdAsync(int id);
    Task<bool> LicenseNumberExistsAsync(string licenseNumber, int? excludeDoctorId = null);
    Task AddAsync(Doctor doctor);
    Task UpdateAsync(Doctor doctor);
    Task SaveChangesAsync();
    Task<List<DoctorDto>> GetExpiredDoctorsAsync();
}