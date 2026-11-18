import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'

export default function VetVisits({ petId }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ reason: '', vetName: '', visitDate: '', nextVisit: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const fetchVisits = async () => {
    try {
      const { data } = await apiFetch(`/pets/${petId}/vetvisits`, { method: "GET" })

      setVisits(data || [])
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    apiFetch(`/pets/${petId}/vetvisits`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setVisits(data || [])
      })
      .catch(error => {
        if (!controller.signal.aborted) setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [petId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await apiFetch(`/pets/${petId}/vetvisits`, {
        method: "POST",
        body: JSON.stringify({
          ...form
        })
      })

      setForm({ reason: '', vetName: '', visitDate: '', nextVisit: '', notes: '' })
      setShowForm(false)
      setAdding(false)
      fetchVisits()
    } catch (error) {
      setError(error.message)
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/pets/${petId}/vetvisits/${id}`, {
        method: 'DELETE'
      })

      fetchVisits()
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const inputClass = 'block w-full min-w-0 min-h-12 py-[11px] px-[13px] text-ink bg-canvas border border-line rounded-xl [font-family:inherit] text-[16px] font-normal leading-[1.5]'
  const labelClass = "text-xs text-muted mb-1 block"
  const isUpcoming = (date) => date && new Date(date) > new Date()

  return (
    <div className="min-w-0 [&_button]:min-w-11 [&_button]:min-h-11 [&_:is(input,select,textarea)]:max-w-full [&_.flex]:min-w-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 [&_h3]:text-ink [&_h3]:text-[17px] [&_h3]:font-semibold
              [&_[role='alert']]:[flex-basis:100%] max-md:[&_h3]:text-[16px]">
        <h3 className="font-semibold text-ink">{t('Vet Visits')}</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">
          {t('addVisit')}
        </button>
        {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="grid gap-5 text-ink [&>label]:grid [&>label]:gap-2 [&>label]:min-w-0 [&>label]:text-[14px]
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
              mb-6 p-5 border border-line rounded-2xl max-md:py-4 max-md:px-3">
          <label className="grid gap-2 min-w-0 text-[14px] font-medium">{t('reason')}
            <input className={inputClass}  value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
          </label>
          <label className="grid gap-2 min-w-0 text-[14px] font-medium">{t('vetName')}
            <input className={inputClass}  value={form.vetName}
            onChange={e => setForm(f => ({ ...f, vetName: e.target.value }))} />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor={'visitDate-' + petId} className={labelClass}>{t('visitDate')}</label>
              <input className={inputClass} id={'visitDate-' + petId} type="date" value={form.visitDate}
                onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))} required />
            </div>
            <div>
              <label htmlFor={'nextVisit-' + petId} className={labelClass}>{t('nextVisit')}</label>
              <input className={inputClass} id={'nextVisit-' + petId} type="date" value={form.nextVisit}
                onChange={e => setForm(f => ({ ...f, nextVisit: e.target.value }))} />
            </div>
          </div>
          <label className="grid gap-2 min-w-0 text-[14px] font-medium">{t('notes')}
            <input className={inputClass}  value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] flex-1 glass">
              {t('cancel')}
            </button>
            <button type="submit" disabled={adding}
              className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none flex-1">
              {adding ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted">{t('load')}</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-muted text-center py-6">{t('noVisits')}</p>
      ) : (
        <div className="grid gap-0">
          {visits.map(visit => (
            <div key={visit.id}
              className="items-start justify-between gap-3 py-4.5 px-0 bg-transparent border-b border-line [&>div]:min-w-0 [&>div]:wrap-anywhere [&_p]:min-w-0 [&_p]:wrap-anywhere block">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-ink">{visit.reason}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(visit.visitDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-GB', { dateStyle: 'medium' })}
                    {visit.vetName && ` · ${visit.vetName}`}
                  </p>
                  {visit.nextVisit && (
                    <p className={`text-xs mt-1 font-medium ${isUpcoming(visit.nextVisit)
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-muted'
                      }`}>
                      {t('nextVisit')}: {new Date(visit.nextVisit).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-GB', { dateStyle: 'medium' })}
                      {isUpcoming(visit.nextVisit) && ' ⏰'}
                    </p>
                  )}
                  {visit.notes && (
                    <p className="text-xs text-muted mt-0.5">{visit.notes}</p>
                  )}
                </div>
                <button aria-label={t('remove')} onClick={() => handleDelete(visit.id)}
                  className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] disabled:opacity-[0.55] disabled:cursor-wait text-[#a52940] dark:text-[#fda4af]
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}