const rawEnvBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')
const envBase = rawEnvBase
  ? rawEnvBase.endsWith('/api')
    ? rawEnvBase
    : `${rawEnvBase}/api`
  : ''
const origin = typeof window !== 'undefined' ? window.location.origin : ''
const base = envBase || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : `${origin}/api`)

export async function postAgent(payload: { request: string }) {
  let response
  try {
    response = await fetch(`${base}/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error: any) {
    throw new Error(`Unable to connect to backend at ${base || '/agent'}: ${error?.message || 'Network error'}`)
  }

  const text = await response.text().catch(() => '')
  let data: any = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text }
  }

  if (!response.ok) {
    throw new Error(data.detail || data.error || data.message || `Failed to generate document (${response.status})`)
  }

  return data
}

export function getDownloadUrl(result: any) {
  if (result?.download_url) return result.download_url
  if (!result?.docx_file) return null
  const filename = result.docx_file.split('/').pop()
  if (!filename) return null
  return `${base}/download/${encodeURIComponent(filename)}`
}

export function getApiBaseUrl() {
  return base
}
