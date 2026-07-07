"use client"
import { useEffect, useState } from 'react'
import { ArrowRight, FileText, Download, Copy, Clock3, Sparkles } from 'lucide-react'
import OutputPanel from './OutputPanel'
import { postAgent, getDownloadUrl } from '../services/api'
import { AgentResponse, HistoryItem } from '../types'

const examplePrompts = [
  'Write a one-page executive summary and task list for migrating to Groq.',
  'Generate a DOCX report outlining the risks and benefits of a cloud migration.',
  'Create a project status update with action items for the AI ops team.',
]

function readHistory() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem('agentdoc_history') || '[]') as HistoryItem[]
  } catch {
    return []
  }
}

function writeHistory(items: HistoryItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('agentdoc_history', JSON.stringify(items))
}

export default function Generator() {
  const [request, setRequest] = useState('')
  const [result, setResult] = useState<AgentResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    setHistory(readHistory())
  }, [])

  const downloadUrl = getDownloadUrl(result)
  const charCount = request.length
  const isValid = request.trim().length > 10

  async function handleGenerate() {
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const data = await postAgent({ request })
      setResult(data)
      const item: HistoryItem = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        prompt: request,
        result: data,
      }
      const nextHistory = [item, ...history].slice(0, 10)
      writeHistory(nextHistory)
      setHistory(nextHistory)
      setRequest('')
    } catch (e: any) {
      setError(e?.message || 'Unable to generate the document. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleExampleClick(example: string) {
    setRequest(example)
    setError(null)
    setResult(null)
  }

  function handleCopyOutput() {
    if (!result?.summary) return
    navigator.clipboard.writeText(result.summary)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Prompt Builder</p>
              <h2 className="text-3xl font-semibold text-white">Describe the document you need.</h2>
              <p className="text-slate-400">The agent will plan, execute, and generate a downloadable DOCX report based on your request.</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Write something like: Create a 1-page summary, task list, and recommendations for migrating to Groq."
                className="min-h-[180px] w-full rounded-3xl border border-white/10 bg-slate-950/90 p-5 text-base text-slate-100 outline-none transition focus:border-indigo-500/60"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Character count: <span className="font-semibold text-white">{charCount}</span></p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!isValid || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Document'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-white">Example prompts</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleExampleClick(prompt)}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-indigo-500/40 hover:bg-slate-900"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <h3 className="text-base font-semibold text-white">Progress</h3>
              <div className="space-y-3">
                {['Planning', 'Executing', 'Generating Document', 'Finished'].map((label, index) => {
                  const active = loading && index < 3
                  const done = result && index < 4
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${done ? 'bg-emerald-400 text-slate-950' : active ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                        {index + 1}
                      </span>
                      <p className={`text-sm ${done ? 'text-white' : 'text-slate-400'}`}>{label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center gap-3 text-slate-300">
              <Sparkles size={20} />
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">Fast API integration</p>
            </div>
            <p className="mt-4 text-slate-300">The frontend connects to your backend using {`NEXT_PUBLIC_API_URL`} and supports downloadable DOCX, history, and graceful error handling.</p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">History</p>
            <p className="mt-3 text-slate-300">Your latest prompts and results are saved locally in the browser for quick reuse.</p>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-400">No history yet. Generate your first document to see recent requests here.</div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRequest(item.prompt)
                      setResult(item.result)
                    }}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-left transition hover:border-indigo-500/40"
                  >
                    <p className="text-sm text-slate-200">{item.prompt}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          {error}
        </div>
      ) : null}

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-300 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-indigo-500/20" />
            <div>
              <p className="text-lg font-semibold text-white">Generating your document...</p>
              <p className="text-sm text-slate-400">This may take a minute while the agent plans and generates the file.</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <OutputPanel data={result} />
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleCopyOutput}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              <Copy size={16} /> Copy summary
            </button>
            <a
              href={downloadUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center gap-2 rounded-3xl px-4 py-3 text-sm font-semibold transition ${downloadUrl ? 'bg-emerald-600 text-white hover:opacity-90' : 'cursor-not-allowed bg-slate-800 text-slate-500'}`}
            >
              <Download size={16} /> Download DOCX
            </a>
            <button
              type="button"
              onClick={() => {
                const json = JSON.stringify(result, null, 2)
                const blob = new Blob([json], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'agent-response.json'
                link.click()
                URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              <FileText size={16} /> Download JSON
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
