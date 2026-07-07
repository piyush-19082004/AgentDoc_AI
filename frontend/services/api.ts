const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || (() => {
  if (typeof window === 'undefined') return ''
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000'
  }
  return ''
})()

export async function postAgent(payload: { request: string }) {
  const response = await fetch(`${base}/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

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
