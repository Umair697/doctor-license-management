"use client";

import { useEffect, useState } from "react";
import DoctorForm from "../components/DoctorForm";
import DoctorTable from "../components/DoctorTable";
import { Doctor } from "../types/doctor";
import {
  createDoctor,
  deleteDoctor,
  fetchDoctors,
  updateDoctor,
} from "../lib/api";

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDoctors() {
    try {
      setLoading(true);
      const data = await fetchDoctors(search, status);
      setDoctors(data);
    } catch {
      setMessage("Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  async function handleSubmit(data: any) {
    try {
      setMessage("");

      if (selectedDoctor) {
        await updateDoctor(selectedDoctor.id, data);
        setMessage("Doctor updated successfully.");
      } else {
        await createDoctor(data);
        setMessage("Doctor created successfully.");
      }

      setSelectedDoctor(null);
      await loadDoctors();
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = confirm("Are you sure you want to delete this doctor?");

    if (!confirmed) return;

    try {
      await deleteDoctor(id);
      setMessage("Doctor deleted successfully.");
      await loadDoctors();
    } catch {
      setMessage("Unable to delete doctor.");
    }
  }

  function handleSearch() {
    loadDoctors();
  }

  function handleReset() {
    setSearch("");
    setStatus("");
    setTimeout(() => {
      loadDoctors();
    }, 0);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor License Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage doctor licenses, expiry status and license records.
          </p>
        </div>

        {message && (
          <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded">
            {message}
          </div>
        )}

        <DoctorForm
          selectedDoctor={selectedDoctor}
          onSubmit={handleSubmit}
          onCancel={() => setSelectedDoctor(null)}
        />

        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or license number"
            className="border p-3 rounded flex-1 placeholder:text-slate-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded text-slate-700"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded text-slate-700 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            Loading doctors...
          </div>
        ) : (
          <DoctorTable
            doctors={doctors}
            onDelete={handleDelete}
            onEdit={setSelectedDoctor}
          />
        )}
      </div>
    </main>
  );
}