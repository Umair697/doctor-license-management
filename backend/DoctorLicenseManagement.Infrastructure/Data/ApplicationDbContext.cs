using DoctorLicenseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace DoctorLicenseManagement.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Doctor> Doctors => Set<Doctor>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.ToTable("Doctors");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.FullName)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.Specialization)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.LicenseNumber)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasIndex(x => x.LicenseNumber)
                .IsUnique();

            entity.Property(x => x.Status)
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(x => x.CreatedDate)
                .HasDefaultValueSql("SYSUTCDATETIME()");

            entity.Property(x => x.IsDeleted)
                .HasDefaultValue(false);
        });
    }
}