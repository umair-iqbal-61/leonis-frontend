import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'

const TYPES = ['feeding', 'medication', 'vet', 'grooming', 'other']
const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']


export default function Reminders({ petId }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [notifStatus, setNotifStatus] = useState(window.Notification?.permission || 'unsupported')
  const [form, setForm] = useState({
    title: '', type: 'feeding', remindAt: '08:00', days: ['daily'], isActive: true
  })
  const [error, setError] = useState()

  const fetchReminders = async () => {
    try {
      const { data } = await apiFetch(`/pets/${petId}/reminders`, { method: "GET" })

      setReminders(data || [])
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    apiFetch(`/pets/${petId}/reminders`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setReminders(data || [])
      })
      .catch(error => {
        if (!controller.signal.aborted) setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [petId])

  const requestNotifPermission = async () => {
    const result = await Notification.requestPermission()
    setNotifStatus(result)
  }

  const toggleDay = (day) => {
    if (day === 'daily') { setForm(f => ({ ...f, days: ['daily'] })); return }
    setForm(f => {
      const days = f.days.filter(d => d !== 'daily')
      return {
        ...f,
        days: days.includes(day) ? days.filter(d => d !== day) : [...days, day]
      }
    })
  }

  const toUTCTimeString = (localTimeStr) => {
    const [hours, minutes] = localTimeStr.split(':').map(Number)

    const d = new Date()
    d.setHours(hours, minutes, 0, 0)

    const utcHours = String(d.getUTCHours()).padStart(2, '0')
    const utcMinutes = String(d.getUTCMinutes()).padStart(2, '0')

    return `${utcHours}:${utcMinutes}`
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (form.days.length === 0) return alert(t('pickDay'))
    setAdding(true)
    try {
      await apiFetch(`/pets/${petId}/reminders`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          remindAt: toUTCTimeString(form.remindAt)
        })
      })

      setForm({ title: '', type: 'feeding', remindAt: '08:00', days: ['daily'], isActive: true })
      setShowForm(false)
      setAdding(false)
      fetchReminders()
    } catch (error) {
      setError(error.message)
      setAdding(false)
    }
  }

  const toggleActive = async (reminder) => {
    try {
      await apiFetch(`/pets/${petId}/reminders/${reminder.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !reminder.isActive })
      })
      fetchReminders()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/pets/${petId}/reminders/${id}`, {
        method: 'DELETE'
      })

      fetchReminders()
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const inputClass = 'block w-full min-w-0 min-h-12 py-[11px] px-[13px] text-ink bg-canvas border border-line rounded-xl [font-family:inherit] text-[16px] font-normal leading-[1.5]'

  return (
    <div className="min-w-0 [&_button]:min-w-11 [&_button]:min-h-11 [&_:is(input,select,textarea)]:max-w-full [&_.flex]:min-w-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 [&_h3]:text-ink [&_h3]:text-[17px] [&_h3]:font-semibold
              [&_[role='alert']]:[flex-basis:100%] max-md:[&_h3]:text-[16px]">
        <h3 className="font-semibold text-ink">{t('Reminders')}</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">
          {t('addReminder')}
        </button>
        {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      </div>

      {/* Notification permission banner */}
      {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 mb-4 flex justify-between items-center">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {notifStatus === 'denied'
              ? t('notificationsBlocked')
              : t('enableNotifications')}
          </p>
          {notifStatus !== 'denied' && (
            <button onClick={requestNotifPermission}
              className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">
              {t('enable')}
            </button>
          )}
        </div>
      )}

      {/* Add form */}
      {
        showForm && (
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
            <label className="grid gap-2 min-w-0 text-[14px] font-medium">{t('reminderTitle')}
              <input className={inputClass}  value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label htmlFor={'reminder-type-' + petId} className="text-xs text-muted mb-1 block">{t('type')}</label>
                <select id={'reminder-type-' + petId} className={inputClass} value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {TYPES.map(type => (
                    <option key={type} value={type}>{t(type)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'reminder-time-' + petId} className="text-xs text-muted mb-1 block">{t('time')}</label>
                <input className={inputClass} id={'reminder-time-' + petId} type="time" value={form.remindAt}
                  onChange={e => setForm(f => ({ ...f, remindAt: e.target.value }))} required />
              </div>
            </div>

            {/* Day picker */}
            <div>
              <label className="text-xs text-muted mb-2 block">{t('repeat')}</label>
              <div className="flex gap-1.5 flex-wrap">
                <button type="button" aria-pressed={form.days.includes('daily')} onClick={() => toggleDay('daily')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${form.days.includes('daily')
                    ? 'bg-violet-600 text-white'
                    : 'bg-surface border border-line text-muted'
                    }`}>
                  {t('daily')}
                </button>
                {ALL_DAYS.map(day => (
                  <button key={day} type="button" aria-pressed={form.days.includes(day) && !form.days.includes('daily')} onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${form.days.includes(day) && !form.days.includes('daily')
                      ? 'bg-violet-600 text-white'
                      : 'bg-surface border border-line text-muted'
                      }`}>
                    {t(day)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
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
                {adding ? t('saving') : t('saveReminder')}
              </button>
            </div>
          </form>
        )
      }

      {/* Reminder list */}
      {
        loading ? (
          <p className="text-sm text-muted">{t('load')}</p>
        ) : reminders.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">{t('noReminders')}</p>
        ) : (
          <div className="grid gap-0">
            {reminders.map(r => (
              <div key={r.id}
                className={`flex items-start justify-between gap-3 py-4.5 px-0 bg-transparent border-b border-line [&>div]:min-w-0 [&>div]:wrap-anywhere [&_p]:min-w-0 [&_p]:wrap-anywhere transition-opacity ${r.isActive ? 'opacity-100' : 'opacity-70'
                  }`}>
                <div className="flex items-center gap-3">

                  <div>
                    <p className="text-sm font-medium text-ink">{r.title}</p>
                    <p className="text-xs text-muted">
                      {new Date(r.remindAt).toLocaleTimeString(language === 'ur' ? 'ur-PK' : 'en-GB', { hour: '2-digit', minute: '2-digit' })} ·{' '}
                      {r.days.includes('daily')
                        ? t('everyDay')
                        : r.days.map(d => t(d)).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Toggle */}
                  <button type="button" role="switch" aria-checked={r.isActive} aria-label={t('toggleReminder')}
                    onClick={() => toggleActive(r)} className="relative flex-[0_0_44px] w-11 min-h-11 cursor-pointer before:absolute before:content-[''] before:start-[3px] before:top-3 before:w-9.5 before:h-5.5
              before:rounded-full before:bg-line aria-checked:before:bg-[#7c3aed] [&_span]:absolute [&_span]:start-1.5
              [&_span]:top-[15px] [&_span]:w-4 [&_span]:h-4 [&_span]:rounded-full [&_span]:bg-white
              [&_span]:transition-[transform] [&_span]:duration-[150ms] [&_span]:ease-[ease]
              aria-checked:[&_span]:translate-x-4 rtl:aria-checked:[&_span]:-translate-x-4">
                    <span aria-hidden="true" />
                  </button>
                  <button aria-label={t('remove')} onClick={() => handleDelete(r.id)}
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
        )
      }
    </div >
  )
}