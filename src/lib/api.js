const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token")

  const isFormData = options.body instanceof FormData

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" })
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (response.ok === false) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}