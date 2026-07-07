"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Clock3, Trash2 } from 'lucide-react'
import { HistoryItem } from '../../types'

function readHistory() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem('agentdoc_history') || '[]') as HistoryItem[]
  } catch {
    return []
  }
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    setHistory(readHistory())
  }, [])

  function handleReuse(item: HistoryItem) {
    router.push(`/generator?prompt=${encodeURIComponent(item.prompt)}`)
  }

  function handleClear() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem('agentdoc_history')
    setHistory([])
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Prompt History</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Reuse your recent AI document requests.</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Browse generated prompts and results, then reopen any request in the generator for a quick retry or edit.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/generator" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Open generator
              </Link>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <Trash2 size={16} /> Clear history
              </button>
            </div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-10 text-slate-300 shadow-2xl shadow-slate-950/30">
            <p className="text-lg font-semibold text-white">No saved prompts yet.</p>
            <p className="mt-3">Generate your first document in the generator, and the request will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <div key={item.id} className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">{new Date(item.createdAt).toLocaleString()}</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">{item.prompt}</h2>
                    <p className="mt-3 text-slate-300">Response summary:</p>
                    <p className="mt-2 text-slate-200 line-clamp-3">{item.result.summary || 'No summary available.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleReuse(item)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <ArrowRight size={16} /> Reopen request
                    </button>
                    {item.result.docx_file && (
                      <a
                        href={item.result.download_url || `/download/${encodeURIComponent(item.result.docx_file.split('/').pop() ?? '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                      >
                        Download file
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
