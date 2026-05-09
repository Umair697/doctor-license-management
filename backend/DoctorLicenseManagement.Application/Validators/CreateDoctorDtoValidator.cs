using DoctorLicenseManagement.Application.DTOs;
using FluentValidation;

namespace DoctorLicenseManagement.Application.Validators;

public class CreateDoctorDtoValidator : AbstractValidator<CreateDoctorDto>
{
    public CreateDoctorDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(150);

        RuleFor(x => x.Specialization)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.LicenseNumber)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.LicenseExpiryDate)
            .NotEmpty();

        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(status => status is "Active" or "Suspended")
            .WithMessage("Status must be Active or Suspended.");
    }
}