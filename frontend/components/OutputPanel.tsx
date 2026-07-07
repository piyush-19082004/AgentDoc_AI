import { useMemo } from 'react'
import { Clock3, Download } from 'lucide-react'
import { getDownloadUrl } from '../services/api'
import { AgentResponse, TaskResult } from '../types'

function StatCard({label, value}:{label:string,value:string}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

function TaskList({tasks}:{tasks: TaskResult[]}) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.task_id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-white">{task.title}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.status === 'completed' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
              {task.status}
            </span>
          </div>
          {task.output && <p className="mt-2 text-sm text-slate-300">{task.output}</p>}
        </div>
      ))}
    </div>
  )
}

export default function OutputPanel({data}:{data:AgentResponse}){
  const downloadUrl = getDownloadUrl(data)
  const processingTime = useMemo(() => {
    const timestamps = data.completed_tasks
      ?.map((task) => task.timestamp)
      .filter(Boolean)
      .map((value) => new Date(value || '').getTime())
      .filter((time) => !Number.isNaN(time)) || []
    if (timestamps.length < 2) return null
    const diff = Math.abs(Math.max(...timestamps) - Math.min(...timestamps))
    return `${Math.round(diff / 1000)}s`
  }, [data.completed_tasks])

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Generation Summary</h3>
            <p className="mt-3 text-slate-300">{data.summary}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Assumptions" value={`${data.assumptions?.length ?? 0}`} />
            <StatCard label="Tasks" value={`${data.completed_tasks?.length ?? 0}`} />
            <StatCard label="Time" value={processingTime ?? 'N/A'} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Summary preview</p>
            <div className="mt-4 rounded-3xl bg-slate-900/90 p-4 text-slate-200">
              <pre className="whitespace-pre-wrap break-words text-sm">{data.summary || ''}</pre>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Execution Plan</p>
            {data.execution_plan ? (
              <div className="mt-4 space-y-3 text-slate-200">
                <p className="text-sm text-slate-300">{data.execution_plan.goal}</p>
                <div className="space-y-2">
                  {data.execution_plan.tasks?.map((task) => (
                    <div key={task.id} className="rounded-2xl bg-slate-900/70 p-3">
                      <p className="font-semibold text-white">{task.title}</p>
                      <p className="text-sm text-slate-400">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No execution plan available.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {downloadUrl && (
            <a href={downloadUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
              <Download size={16} /> Download DOCX
            </a>
          )}
          {data.docx_file && (
            <p className="text-sm text-slate-400">Saved file: {data.docx_file.split('/').pop()}</p>
          )}
        </div>
      </div>

      {data.completed_tasks?.length ? (
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Task Results</h3>
              <p className="mt-1 text-slate-400">Review each task output from the agent.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
              <Clock3 size={16} /> {processingTime ?? 'Time unavailable'}
            </span>
          </div>
          <div className="mt-6">
            <TaskList tasks={data.completed_tasks} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
