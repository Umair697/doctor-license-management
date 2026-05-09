using DoctorLicenseManagement.Application.DTOs;

namespace DoctorLicenseManagement.Application.Interfaces;

public interface IDoctorService
{
    Task<List<DoctorDto>> GetAllAsync(string? search, string? status);
    Task<DoctorDto?> GetByIdAsync(int id);
    Task<DoctorDto> CreateAsync(CreateDoctorDto dto);
    Task<bool> UpdateAsync(int id, UpdateDoctorDto dto);
    Task<bool> UpdateStatusAsync(int id, UpdateDoctorStatusDto dto);
    Task<bool> DeleteAsync(int id);
    Task<List<DoctorDto>> GetExpiredDoctorsAsync();
}