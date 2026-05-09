const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDoctors(search = "", status = "") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(
    `${API_BASE_URL}/doctors?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return response.json();
}

export async function createDoctor(data: any) {
  const response = await fetch(`${API_BASE_URL}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create doctor");
  }

  return response.json();
}

export async function updateDoctor(id: number, data: any) {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update doctor");
  }
}

export async function deleteDoctor(id: number) {
  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete doctor");
  }
}