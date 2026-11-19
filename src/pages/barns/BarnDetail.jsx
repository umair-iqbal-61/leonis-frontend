import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { barnText, barnError, barnInput, barnButton, barnPrimary } from '../../lib/barn'
import BarnCattle from './BarnCattle'
import BarnLedger from './BarnLedger'
import BarnReport from './BarnReport'
function Settings({ barn, refresh }) {
  const { language } = useLanguage(), t = key => barnText(language, key)
  const [form, setForm] = useState({ name: barn.name, location: barn.location ?? '', notes: barn.notes ?? '', archived: barn.archived }), [busy, setBusy] = useState(false), [error, setError] = useState(''), [saved, setSaved] = useState(false)
  return <form className="grid gap-5 max-w-180" onSubmit={async event => {
    event.preventDefault(); if (busy) return; setBusy(true); setError(''); setSaved(false)
    try { const { data } = await apiFetch(`/barns/${barn.id}`, { method: 'PATCH', body: JSON.stringify({ ...form, expectedVersion: barn.version }) }); refresh(data); setSaved(true) }
    catch (error) { setError(barnError(error)) } finally { setBusy(false) }
  }}><h2 className="text-xl font-semibold">{t('settings')}</h2>
    {['name', 'location'].map(field => <label key={field} className="grid gap-2 text-sm">{t(field)}<input className={barnInput} required={field === 'name'} maxLength={field === 'name' ? 100 : 150} disabled={busy} value={form[field]} onChange={event => { setForm(current => ({ ...current, [field]: event.target.value })); setSaved(false) }} /></label>)}
    <label className="grid gap-2 text-sm">{t('notes')}<textarea className={`${barnInput} min-h-24`} maxLength={2000} disabled={busy} value={form.notes} onChange={event => { setForm(current => ({ ...current, notes: event.target.value })); setSaved(false) }} /></label>
    <label className="flex items-start gap-3 text-sm"><input className="h-5 w-5 shrink-0 accent-violet-700" type="checkbox" disabled={busy} checked={form.archived} onChange={event => { setForm(current => ({ ...current, archived: event.target.checked })); setSaved(false) }} />{t('archive')}</label><p className="text-sm text-muted leading-relaxed">{t('archiveHint')}</p>
    {error && <p role="alert" className="text-rose-700 dark:text-rose-300">{t(error)}</p>}{saved && <p role="status" className="text-accent">{t('saved')}</p>}<div><button className={barnPrimary} disabled={busy}>{t(busy ? 'saving' : 'save')}</button></div>
  </form>
}
export default function BarnDetail() {
  const { id } = useParams(), { language } = useLanguage(), t = key => barnText(language, key)
  const [data, setData] = useState(null), [error, setError] = useState(''), [revision, setRevision] = useState(0), [view, setView] = useState('report')
  const refresh = updated => {
    if (updated?.id === Number(id)) setData(current => current ? { ...current, barn: { ...current.barn, ...updated } } : current)
    setRevision(value => value + 1)
  }
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([apiFetch(`/barns/${id}`, { signal: controller.signal }), apiFetch('/barns/animals', { signal: controller.signal })]).then(([barn, animals]) => { if (!controller.signal.aborted) { setData({ barn: barn.data, animals: animals.data }); setError('') } }).catch(error => { if (!controller.signal.aborted) setError(barnError(error)) })
    return () => controller.abort()
  }, [id, revision])
  if (error) return <div role="alert"><p>{t(error)}</p><button className={`${barnButton} mt-4`} onClick={refresh}>{t('retry')}</button></div>
  if (data?.barn.id !== Number(id)) return <p role="status">{t('loading')}</p>
  const { barn, animals } = data, tabs = ['report', 'cattle', 'ledger', 'history', 'settings']
  return <article className="min-w-0 animate-workspace-enter motion-reduce:animate-none">
    <Link to="/barns" className="inline-flex min-h-11 items-center text-muted text-sm mb-4">{t('back')}</Link>
    <h1 className="text-3xl md:text-4xl font-semibold wrap-anywhere">{barn.name}</h1><p className="text-muted mt-2 wrap-anywhere">{barn.location}</p>{barn.notes && <p className="text-sm text-muted mt-3 whitespace-pre-wrap wrap-anywhere">{barn.notes}</p>}
    {barn.archived && <p className="mt-4 text-sm text-accent">{t('archivedHint')}</p>}
    <div className="my-8"><label className="md:hidden grid gap-2 text-sm">{t('barns')}<select className={barnInput} value={view} onChange={event => setView(event.target.value)}>{tabs.map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label><nav className="hidden md:flex flex-wrap gap-2 border-b border-line pb-4" aria-label={t('barns')}>{tabs.map(value => <button key={value} className={value === view ? barnPrimary : barnButton} aria-pressed={value === view} onClick={() => setView(value)}>{t(value)}</button>)}</nav></div>
    {view === 'report' && <BarnReport key={barn.id} barn={barn} revision={revision} />}
    {view === 'cattle' && <BarnCattle key={`cattle-${barn.id}`} barn={barn} animals={animals} refresh={refresh} />}
    {view === 'history' && <BarnCattle key={`history-${barn.id}`} barn={barn} animals={animals} refresh={refresh} history />}
    {view === 'ledger' && <BarnLedger key={barn.id} barn={barn} refresh={refresh} revision={revision} />}
    {view === 'settings' && <Settings key={barn.id} barn={barn} refresh={refresh} />}
  </article>
}
