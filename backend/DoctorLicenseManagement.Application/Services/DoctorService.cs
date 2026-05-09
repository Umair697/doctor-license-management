using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Application.Interfaces;
using DoctorLicenseManagement.Domain.Entities;

namespace DoctorLicenseManagement.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;

    public DoctorService(IDoctorRepository doctorRepository)
    {
        _doctorRepository = doctorRepository;
    }

    public async Task<List<DoctorDto>> GetAllAsync(string? search, string? status)
    {
        return await _doctorRepository.GetAllAsync(search, status);
    }

    public async Task<DoctorDto?> GetByIdAsync(int id)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);

        if (doctor is null)
            return null;

        return MapToDto(doctor);
    }

    public async Task<DoctorDto> CreateAsync(CreateDoctorDto dto)
    {
        if (await _doctorRepository.LicenseNumberExistsAsync(dto.LicenseNumber))
            throw new InvalidOperationException("License number already exists.");

        var doctor = new Doctor
        {
            FullName = dto.FullName.Trim(),
            Email = dto.Email.Trim(),
            Specialization = dto.Specialization.Trim(),
            LicenseNumber = dto.LicenseNumber.Trim(),
            LicenseExpiryDate = dto.LicenseExpiryDate,
            Status = GetValidStatus(dto.Status, dto.LicenseExpiryDate),
            CreatedDate = DateTime.UtcNow,
            IsDeleted = false
        };

        await _doctorRepository.AddAsync(doctor);
        await _doctorRepository.SaveChangesAsync();

        return MapToDto(doctor);
    }

    public async Task<bool> UpdateAsync(int id, UpdateDoctorDto dto)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);

        if (doctor is null)
            return false;

        if (await _doctorRepository.LicenseNumberExistsAsync(dto.LicenseNumber, id))
            throw new InvalidOperationException("License number already exists.");

        doctor.FullName = dto.FullName.Trim();
        doctor.Email = dto.Email.Trim();
        doctor.Specialization = dto.Specialization.Trim();
        doctor.LicenseNumber = dto.LicenseNumber.Trim();
        doctor.LicenseExpiryDate = dto.LicenseExpiryDate;
        doctor.Status = GetValidStatus(dto.Status, dto.LicenseExpiryDate);

        await _doctorRepository.UpdateAsync(doctor);
        await _doctorRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateStatusAsync(int id, UpdateDoctorStatusDto dto)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);

        if (doctor is null)
            return false;

        doctor.Status = GetValidStatus(dto.Status, doctor.LicenseExpiryDate);

        await _doctorRepository.UpdateAsync(doctor);
        await _doctorRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var doctor = await _doctorRepository.GetByIdAsync(id);

        if (doctor is null)
            return false;

        doctor.IsDeleted = true;

        await _doctorRepository.UpdateAsync(doctor);
        await _doctorRepository.SaveChangesAsync();

        return true;
    }

    private static string GetValidStatus(string requestedStatus, DateTime licenseExpiryDate)
    {
        if (licenseExpiryDate.Date < DateTime.UtcNow.Date)
            return "Expired";

        return requestedStatus;
    }

    private static DoctorDto MapToDto(Doctor doctor)
    {
        return new DoctorDto
        {
            Id = doctor.Id,
            FullName = doctor.FullName,
            Email = doctor.Email,
            Specialization = doctor.Specialization,
            LicenseNumber = doctor.LicenseNumber,
            LicenseExpiryDate = doctor.LicenseExpiryDate,
            Status = GetValidStatus(doctor.Status, doctor.LicenseExpiryDate),
            CreatedDate = doctor.CreatedDate
        };
    }

    public async Task<List<DoctorDto>> GetExpiredDoctorsAsync()
    {
        return await _doctorRepository.GetExpiredDoctorsAsync();
    }
}