function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '')
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`
    }
    return `${clean}/ordonez/students`
  }
  return '/ordonez/students'
}

const API_BASE_URL = getApiBaseUrl()

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  // Handle empty or text responses
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export const studentService = {
  async getAll() {
    const res = await fetch(API_BASE_URL)
    return handleResponse(res)
  },

  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`)
    return handleResponse(res)
  },

  async create(studentData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    })
    return handleResponse(res)
  },

  async update(id, studentData) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    })
    return handleResponse(res)
  },

  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    return handleResponse(res)
  },
}
