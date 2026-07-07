import Generator from '../../components/Generator'

export default function GeneratorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-indigo-950/80 p-8 shadow-2xl shadow-indigo-900/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Document Generator</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Create polished AI-generated DOCX reports</h1>
            </div>
            <p className="max-w-xl text-slate-300">Write your prompt, watch the agent plan and execute, then download your Word document with one click.</p>
          </div>
        </div>

        <Generator />
      </div>
    </main>
  )
}
