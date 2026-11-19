import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { barnText, barnError, barnDay, barnToday, barnInput, barnButton, barnPrimary } from '../../lib/barn'
export default function BarnCattle({ barn, animals, refresh, history = false }) {
  const { language } = useLanguage(), t = (key, params) => barnText(language, key, params)
  const [form, setForm] = useState({ petId: '', startedOn: barnToday() }), [end, setEnd] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const request = useRef(null)
  const current = barn.memberships.filter(item => !item.endedOn && item.petId != null)
  const available = animals.filter(item => !current.some(member => member.petId === item.id))
  async function action(fn) {
    if (busy) return
    setBusy(true); setError('')
    try { await fn(); refresh() } catch (error) { setError(barnError(error)) } finally { setBusy(false) }
  }
  return <section className="min-w-0">
    <h2 className="text-xl font-semibold mb-5">{t(history ? 'history' : 'cattle')}</h2>
    {error && <p role="alert" className="text-rose-700 dark:text-rose-300 mb-5">{t(error)}</p>}
    {history ? !barn.memberships.length ? <p className="text-muted">{t('noHistory')}</p> : <ul className="divide-y divide-line">{barn.memberships.map(item => <li key={item.id} className="py-5"><p className="font-semibold wrap-anywhere">{item.pet?.name ?? item.animalName} {item.petId == null && `(${t('deleted')})`}</p><p className="text-sm text-muted mt-2"><bdi>{barnDay(item.startedOn)}</bdi> — {item.endedOn ? <bdi>{barnDay(item.endedOn)}</bdi> : item.petId == null ? t('deleted') : t('current')}</p></li>)}</ul>
      : <>
        {!current.length ? <p className="text-muted">{t('noCattle')}</p> : <ul className="divide-y divide-line">{current.map(item => <li key={item.id} className="py-5 flex flex-wrap justify-between items-center gap-4"><div><Link className="text-accent font-semibold" to={`/pets/${item.petId}`}>{item.pet?.name ?? item.animalName}</Link><p className="text-sm text-muted mt-1"><bdi>{barnDay(item.startedOn)}</bdi></p></div><button className={barnButton} disabled={busy} onClick={() => setEnd({ id: item.id, date: barnToday() })}>{t('end')}</button></li>)}</ul>}
        {end && <form className="grid gap-4 max-w-150 border-y border-line py-5 my-6" onSubmit={event => { event.preventDefault(); if (!window.confirm(t('endConfirm'))) return; action(async () => { await apiFetch(`/barns/${barn.id}/memberships/${end.id}/end`, { method: 'POST', body: JSON.stringify({ endedOn: end.date }) }); setEnd(null) }) }}>
          <label className="grid gap-2 text-sm">{t('endedOn')}<input className={barnInput} type="date" required max={barnToday()} value={end.date} disabled={busy} onChange={event => setEnd(current => ({ ...current, date: event.target.value }))} /></label><p className="text-sm text-muted">{t('endHint')}</p><div className="flex gap-3 flex-wrap"><button className={barnPrimary} disabled={busy}>{t('end')}</button><button className={barnButton} type="button" disabled={busy} onClick={() => setEnd(null)}>{t('cancel')}</button></div>
        </form>}
        {!barn.archived && <form className="mt-8 pt-7 border-t border-line grid gap-5 max-w-180" onSubmit={event => {
          event.preventDefault(); request.current ??= crypto.randomUUID()
          action(async () => { await apiFetch(`/barns/${barn.id}/assignments`, { method: 'POST', body: JSON.stringify({ ...form, petId: Number(form.petId), requestId: request.current }) }); request.current = null; setForm({ petId: '', startedOn: barnToday() }) })
        }}>
          <h3 className="text-lg font-semibold">{t('assign')}</h3><p className="text-sm text-muted leading-relaxed">{t('transferHint')}</p>
          {!available.length ? <p className="text-muted text-sm">{t('noAvailable')} <Link className="underline text-accent" to="/livestock/add">{t('addAnimal')}</Link></p> : <>
            <label className="grid gap-2 text-sm">{t('chooseAnimal')}<select className={barnInput} value={form.petId} required disabled={busy} onChange={event => { setForm(current => ({ ...current, petId: event.target.value })); request.current = null }}><option value="">{t('chooseAnimal')}</option>{available.map(animal => <option key={animal.id} value={animal.id}>{animal.name} · {animal.barnMemberships[0]?.barn.name ?? t('unassigned')}</option>)}</select></label>
            <label className="grid gap-2 text-sm">{t('startedOn')}<input className={barnInput} type="date" max={barnToday()} required value={form.startedOn} disabled={busy} onChange={event => { setForm(current => ({ ...current, startedOn: event.target.value })); request.current = null }} /></label><div><button className={barnPrimary} disabled={busy}>{t(busy ? 'saving' : 'assign')}</button></div>
          </>}
        </form>}
      </>}
  </section>
}
