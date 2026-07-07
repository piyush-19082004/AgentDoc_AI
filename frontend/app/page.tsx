import Link from 'next/link'
import Hero from '../components/Hero'

const featureCards = [
  {
    title: 'AI Document Generation',
    description: 'Convert prompts into polished DOCX reports automatically with fast, reliable output.',
  },
  {
    title: 'Task Automation',
    description: 'See planning, execution, and document generation all in one streamlined workflow.',
  },
  {
    title: 'Download & Share',
    description: 'Save DOCX results, export JSON metadata, and revisit past generations from history.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10">
        <Hero />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-900/10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">How it works</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Build documents with AI precision</h2>
              </div>
              <Link href="/generator" className="rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:opacity-95">
                Try generator
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featureCards.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-800/80 to-indigo-950/70 p-8 shadow-2xl shadow-slate-900/40">
            <h2 className="text-3xl font-semibold text-white">Launch your AI document workflow</h2>
            <p className="mt-4 text-slate-300">Generate polished reports, save documents, and keep history snapshots for review. Designed for modern SaaS teams that need speed, clarity, and quality.</p>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">• Smart prompt capture with character counter and examples</div>
              <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">• Multi-step progress for planning, execution and document generation</div>
              <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">• Result preview, downloads, and history for repeatable workflows</div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Get started</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Powerful AI document generation, ready to go.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/generator" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-white/10 transition hover:opacity-90">
                Open Generator
              </Link>
              <Link href="/history" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                View History
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
