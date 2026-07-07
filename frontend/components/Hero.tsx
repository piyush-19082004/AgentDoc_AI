import Link from 'next/link'

export default function Hero() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-indigo-900/20 backdrop-blur-xl">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 ring-1 ring-indigo-500/20">
            AI-powered document generation
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">From prompt to professional Word document in minutes.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            AgentDoc AI combines autonomous planning, execution, and document rendering to generate polished DOCX reports with a modern SaaS experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/generator" className="rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-700 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:opacity-95">
              Generate document
            </Link>
            <Link href="/history" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10">
              View history
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-700 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="relative space-y-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Prompt example</p>
              <p className="mt-4 text-lg leading-8 text-slate-100">Create a one-page executive summary, task list, and recommendations for migrating our AI backend from Gemini to Groq.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Step 1</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Write your request</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Step 2</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Download your DOCX</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
