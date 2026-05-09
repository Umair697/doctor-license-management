# Doctor License Management

Doctor License Management module for a Medical SaaS platform.

## Tech Stack

### Backend
- .NET 8 Web API
- Clean Architecture
- Entity Framework Core
- Dapper
- SQL Server
- Stored Procedures
- FluentValidation
- Swagger

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS

## Features

- Create doctor
- Get all doctors
- Get doctor by ID
- Update doctor
- Update doctor status
- Soft delete doctor
- Search by doctor name or license number
- Filter by status
- Status badges
- License expiry handling
- Stored procedure based doctor listing
- Separate expired doctors endpoint

## Business Rules

- License number must be unique.
- Required fields are validated.
- If license expiry date is before today, doctor status is marked as Expired.
- Expired status logic is also handled inside SQL stored procedure for listing.
- Delete is implemented as soft delete using `IsDeleted`.

## Project Structure

```txt
backend/
├── DoctorLicenseManagement.Api
├── DoctorLicenseManagement.Application
├── DoctorLicenseManagement.Domain
└── DoctorLicenseManagement.Infrastructure

frontend/
└── src/
    ├── app
    ├── components
    ├── lib
    └── types


## Database Setup

CREATE DATABASE DoctorLicenseDb;
GO

USE DoctorLicenseDb;
GO

CREATE TABLE Doctors
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Specialization NVARCHAR(100) NOT NULL,
    LicenseNumber NVARCHAR(100) NOT NULL UNIQUE,
    LicenseExpiryDate DATE NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Active',
    CreatedDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IsDeleted BIT NOT NULL DEFAULT 0
);
GO

CREATE OR ALTER PROCEDURE sp_GetDoctors
    @Search NVARCHAR(150) = NULL,
    @Status NVARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        FullName,
        Email,
        Specialization,
        LicenseNumber,
        LicenseExpiryDate,
        CASE 
            WHEN LicenseExpiryDate < CAST(GETDATE() AS DATE) THEN 'Expired'
            ELSE Status
        END AS Status,
        CreatedDate
    FROM Doctors
    WHERE IsDeleted = 0
      AND (
            @Search IS NULL 
            OR @Search = ''
            OR FullName LIKE '%' + @Search + '%'
            OR LicenseNumber LIKE '%' + @Search + '%'
          )
      AND (
            @Status IS NULL
            OR @Status = ''
            OR (
                @Status = 'Expired' 
                AND LicenseExpiryDate < CAST(GETDATE() AS DATE)
            )
            OR (
                @Status <> 'Expired'
                AND Status = @Status
                AND LicenseExpiryDate >= CAST(GETDATE() AS DATE)
            )
          )
    ORDER BY CreatedDate DESC;
END;
GO


CREATE OR ALTER PROCEDURE sp_GetExpiredDoctors
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        FullName,
        Email,
        Specialization,
        LicenseNumber,
        LicenseExpiryDate,
        'Expired' AS Status,
        CreatedDate
    FROM Doctors
    WHERE IsDeleted = 0
      AND LicenseExpiryDate < CAST(GETDATE() AS DATE)
    ORDER BY LicenseExpiryDate ASC;
END;
GO

## Backend Setup

cd backend

dotnet restore

dotnet build

cd DoctorLicenseManagement.Api
dotnet run

https://localhost:{port}/swagger

## Backend Configuration

Update connection string in:
backend/DoctorLicenseManagement.Api/appsettings.json

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=DoctorLicenseDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "AllowedHosts": "*"
}



## Frontend Setup

cd frontend

npm install

NEXT_PUBLIC_API_BASE_URL=https://localhost:{backend-port}/api

npm run dev

##API Endpoints

http://localhost:3000

GET     /api/doctors
GET     /api/doctors/{id}
GET     /api/doctors/expired
POST    /api/doctors
PUT     /api/doctors/{id}
PATCH   /api/doctors/{id}/status
DELETE  /api/doctors/{id}



## Brief Technical Decisions

Clean Architecture was used to separate API, application logic, infrastructure, and domain models.
EF Core is used for normal CRUD operations.
Dapper is used for stored procedure based listing to keep SQL requirement clear and simple.
Stored procedure handles search, status filter, and expiry status logic.
Soft delete is used to preserve historical records.
FluentValidation is used for request validation.
Next.js App Router with reusable components is used for a clean frontend structure.

