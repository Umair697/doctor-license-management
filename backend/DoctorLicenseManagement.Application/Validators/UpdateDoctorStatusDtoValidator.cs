using DoctorLicenseManagement.Application.DTOs;
using FluentValidation;

namespace DoctorLicenseManagement.Application.Validators;

public class UpdateDoctorStatusDtoValidator : AbstractValidator<UpdateDoctorStatusDto>
{
    public UpdateDoctorStatusDtoValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(status => status is "Active" or "Suspended")
            .WithMessage("Status must be Active or Suspended.");
    }
}