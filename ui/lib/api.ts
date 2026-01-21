// API client for frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function submitForm(data: { name: string; email: string }) {
  // BUG: This doesn't properly check response status
  // It might return success even when the backend fails
  const response = await fetch(`${API_BASE_URL}/api/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Weak error handling - doesn't check response.ok
  const result = await response.json();
  return result;
}
