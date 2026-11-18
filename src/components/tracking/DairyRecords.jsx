import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { recordText } from '../../lib/recordLanguage'

const kinds = ['MILK_YIELD', 'BREEDING', 'CALVING']
const empty = { kind: 'MILK_YIELD', recordedOn: '', liters: '', notes: '', session: '' }
const fieldClass = 'block w-full min-w-0 min-h-12 py-[11px] px-[13px] text-ink bg-canvas border border-line rounded-xl [font-family:inherit] text-[16px] font-normal leading-[1.5]'

export default function DairyRecords({ petId, language }) {
  const [records, setRecords] = useState(null)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const url = `/pets/${petId}/dairy`
  const t = key => recordText(language, key)

  useEffect(() => {
    const controller = new AbortController()
    apiFetch(url, { signal: controller.signal })
      .then(({ data }) => setRecords(data))
      .catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [url])

  function reset() {
    setForm(empty)
    setEditing(null)
  }

  async function write(id, method) {
    setBusy(true)
    setError(false)
    try {
      const options = { method }
      if (method !== 'DELETE') options.body = JSON.stringify(form)
      await apiFetch(id ? `${url}/${id}` : url, options)
      if (method !== 'DELETE' || id === editing) reset()
      const { data } = await apiFetch(url)
      setRecords(data)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  function field(key, value) {
    setForm(old => ({ ...old, [key]: value }))
  }

  return (
    <section className="space-y-4 text-gray-900 dark:text-gray-100">
      <h3 className="font-semibold">{t('dairy')}</h3>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{t('error')}</p>}
      <form className="grid gap-5 text-ink [&>label]:grid [&>label]:gap-2 [&>label]:min-w-0 [&>label]:text-[14px]
              [&>label]:font-medium [&_:is(input:not([type='checkbox']),select,textarea)]:block
              [&_:is(input:not([type='checkbox']),select,textarea)]:w-full
              [&_:is(input:not([type='checkbox']),select,textarea)]:min-w-0
              [&_:is(input:not([type='checkbox']),select,textarea)]:min-h-12
              [&_:is(input:not([type='checkbox']),select,textarea)]:py-[11px]
              [&_:is(input:not([type='checkbox']),select,textarea)]:px-[13px]
              [&_:is(input:not([type='checkbox']),select,textarea)]:text-ink
              [&_:is(input:not([type='checkbox']),select,textarea)]:bg-canvas
              [&_:is(input:not([type='checkbox']),select,textarea)]:border
              [&_:is(input:not([type='checkbox']),select,textarea)]:border-line
              [&_:is(input:not([type='checkbox']),select,textarea)]:rounded-xl
              [&_:is(input:not([type='checkbox']),select,textarea)]:[font-family:inherit]
              [&_:is(input:not([type='checkbox']),select,textarea)]:text-[16px]
              [&_:is(input:not([type='checkbox']),select,textarea)]:font-normal
              [&_:is(input:not([type='checkbox']),select,textarea)]:leading-[1.5] [&_textarea]:resize-y [&_textarea]:min-h-26
              mb-6 p-5 border border-line rounded-2xl max-md:py-4 max-md:px-3 sm:grid-cols-2" onSubmit={event => {
        event.preventDefault()
        write(editing, editing ? 'PUT' : 'POST')
      }}>
        <label className="text-sm">{t('type')}
          <select className={fieldClass} value={form.kind} onChange={event => field('kind', event.target.value)}>
            {kinds.map(kind => <option key={kind} value={kind}>{t(kind)}</option>)}
          </select>
        </label>
        <label className="text-sm">{t('date')}
          <input type="date" required className={fieldClass} value={form.recordedOn} onChange={event => field('recordedOn', event.target.value)} />
        </label>
        {form.kind === 'MILK_YIELD' && <label className="text-sm">{t('liters')}
          <input type="number" step="0.0001" className={fieldClass} value={form.liters} onChange={event => field('liters', event.target.value)} />
        </label>}
        {form.kind === 'MILK_YIELD' && <label className="text-sm">{t('session')}
          <select className={fieldClass} value={form.session} onChange={event => field('session', event.target.value)}>
            {['', 'MORNING', 'AFTERNOON', 'EVENING'].map(session => (
              <option key={session} value={session}>{t(session || 'unknownSession')}</option>
            ))}
          </select>
        </label>}
        <label className="text-sm sm:col-span-2">{t('notes')}
          <textarea className={fieldClass} maxLength={2000} value={form.notes} onChange={event => field('notes', event.target.value)} />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button disabled={busy || loading} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t(editing ? 'save' : 'add')}</button>
          {editing && <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t('cancel')}</button>}
        </div>
      </form>
      {!records && !error && <p role="status">{t('load')}</p>}
      {records?.length === 0 && <p>{t('noDairy')}</p>}
      {records && <ul className="space-y-2">
        {records.map(item => (
          <li key={item.id} className="flex items-start justify-between gap-3 py-4.5 px-0 bg-transparent border-b border-line [&>div]:min-w-0
              [&>div]:wrap-anywhere [&_p]:min-w-0 [&_p]:wrap-anywhere flex-wrap text-sm">
            <div className="min-w-0">
              <p>{t(item.kind)} <bdi>#{item.id} · {item.recordedOn.slice(0, 10)}{item.liters != null && ` · ${item.liters} L`}</bdi></p>
              {item.kind === 'MILK_YIELD' && <p>{t('session')} · {t(item.session || 'unknownSession')}</p>}
              {item.notes && <p className="wrap-anywhere">{item.notes}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" disabled={busy} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" onClick={() => {
                setEditing(item.id)
                setForm({ kind: item.kind, recordedOn: item.recordedOn.slice(0, 10), liters: item.liters ?? '', session: item.session ?? '', notes: item.notes ?? '' })
              }}>{t('edit')}</button>
              <button type="button" disabled={busy} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] disabled:opacity-[0.55] disabled:cursor-wait text-[#a52940] dark:text-[#fda4af]
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" onClick={() => {
                if (window.confirm(t('confirm'))) write(item.id, 'DELETE')
              }}>{t('remove')}</button>
            </div>
          </li>
        ))}
      </ul>}
    </section>
  )
}
