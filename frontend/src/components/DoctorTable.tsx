"use client";

import { Doctor } from "../types/doctor";
import StatusBadge from "./StatusBadge";

interface Props {
  doctors: Doctor[];
  onDelete: (id: number) => void;
  onEdit: (doctor: Doctor) => void;
}

export default function DoctorTable({ doctors, onDelete, onEdit }: Props) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
          🩺
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No doctors found</h3>
        <p className="mt-1 text-sm text-slate-500">Try changing search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {["Doctor", "Specialization", "License", "Expiry", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className={`transition hover:bg-slate-50 ${doctor.status === "Expired" ? "bg-rose-50/40" : ""}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                      {doctor.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{doctor.fullName}</div>
                      <div className="text-sm text-slate-500">{doctor.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">{doctor.specialization}</td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
                    {doctor.licenseNumber}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {new Date(doctor.licenseExpiryDate).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={doctor.status} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(doctor)} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                      Edit
                    </button>

                    <button onClick={() => onDelete(doctor.id)} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}