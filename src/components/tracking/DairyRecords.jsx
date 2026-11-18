import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { recordText } from '../../lib/recordLanguage'

const kinds = ['MILK_YIELD', 'BREEDING', 'CALVING']
const empty = { kind: 'MILK_YIELD', recordedOn: '', liters: '', notes: '' }
const fieldClass = 'w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800'

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
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={event => {
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
        <label className="text-sm sm:col-span-2">{t('notes')}
          <textarea className={fieldClass} maxLength={2000} value={form.notes} onChange={event => field('notes', event.target.value)} />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button disabled={busy || loading} className="rounded-lg bg-violet-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t(editing ? 'save' : 'add')}</button>
          {editing && <button type="button" onClick={reset} className="px-3 text-sm">{t('cancel')}</button>}
        </div>
      </form>
      {!records && !error && <p role="status">{t('load')}</p>}
      {records?.length === 0 && <p>{t('noDairy')}</p>}
      {records && <ul className="space-y-2">
        {records.map(item => (
          <li key={item.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
            <div className="min-w-0">
              <p>{t(item.kind)} <bdi>#{item.id} · {item.recordedOn.slice(0, 10)}{item.liters != null && ` · ${item.liters} L`}</bdi></p>
              {item.notes && <p className="wrap-anywhere">{item.notes}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" disabled={busy} onClick={() => {
                setEditing(item.id)
                setForm({ kind: item.kind, recordedOn: item.recordedOn.slice(0, 10), liters: item.liters ?? '', notes: item.notes ?? '' })
              }}>{t('edit')}</button>
              <button type="button" disabled={busy} className="text-red-600 dark:text-red-400" onClick={() => {
                if (window.confirm(t('confirm'))) write(item.id, 'DELETE')
              }}>{t('remove')}</button>
            </div>
          </li>
        ))}
      </ul>}
    </section>
  )
}
