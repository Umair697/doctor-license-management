"use client";

import { useEffect, useState } from "react";
import { Doctor } from "../types/doctor";

interface Props {
  selectedDoctor: Doctor | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function DoctorForm({
  selectedDoctor,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    status: "Active",
  });

useEffect(() => {
  if (selectedDoctor) {
    setForm({
      fullName: selectedDoctor.fullName,
      email: selectedDoctor.email,
      specialization: selectedDoctor.specialization,
      licenseNumber: selectedDoctor.licenseNumber,
      licenseExpiryDate: selectedDoctor.licenseExpiryDate.split("T")[0],
      status:
        selectedDoctor.status === "Expired"
          ? "Active"
          : selectedDoctor.status,
    });
  } else {
    setForm({
      fullName: "",
      email: "",
      specialization: "",
      licenseNumber: "",
      licenseExpiryDate: "",
      status: "Active",
    });
  }
}, [selectedDoctor]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

 return (
  <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter license details and current doctor status.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" required />

      <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" type="email" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" required />

      <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" required />

      <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="License Number" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" required />

      <input name="licenseExpiryDate" value={form.licenseExpiryDate} onChange={handleChange} type="date" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100" required />

      <select name="status" value={form.status} onChange={handleChange} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100">
        <option value="Active">Active</option>
        <option value="Suspended">Suspended</option>
      </select>
    </div>

    <div className="mt-6 flex gap-3">
      <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700">
        {selectedDoctor ? "Update Doctor" : "Save Doctor"}
      </button>

      {selectedDoctor && (
        <button type="button" onClick={onCancel} className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
          Cancel
        </button>
      )}
    </div>
  </form>
);
}