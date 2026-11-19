import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { barnText, barnError, barnInput, barnButton, barnPrimary } from '../../lib/barn'
export default function BarnList() {
  const { language } = useLanguage(), navigate = useNavigate(), t = key => barnText(language, key)
  const [items, setItems] = useState(null), [form, setForm] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState(''), [retry, setRetry] = useState(0)
  const request = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/barns', { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) { setItems(data); setError('') } }).catch(error => { if (!controller.signal.aborted) setError(barnError(error)) })
    return () => controller.abort()
  }, [retry])
  return <section><div className="flex flex-wrap items-end justify-between gap-4 mb-8"><div><h1 className="text-3xl md:text-4xl font-semibold">{t('barns')}</h1><p className="mt-2 text-muted">{t('intro')}</p></div><button className={barnPrimary} onClick={() => { setForm({ name: '', location: '', notes: '' }); request.current = crypto.randomUUID() }}>{t('newBarn')}</button></div>
    {error && <div role="alert" className="mb-5 text-rose-700 dark:text-rose-300"><p>{t(error)}</p><button className={`${barnButton} mt-3`} onClick={() => setRetry(value => value + 1)}>{t('retry')}</button></div>}
    {form && <form className="grid gap-5 max-w-180 border-y border-line py-7 mb-8" onSubmit={async event => {
      event.preventDefault(); if (busy) return; setBusy(true); setError('')
      try { const { data } = await apiFetch('/barns', { method: 'POST', body: JSON.stringify({ ...form, requestId: request.current }) }); navigate(`/barns/${data.id}`) }
      catch (error) { setError(barnError(error)) } finally { setBusy(false) }
    }}>
      {['name', 'location'].map(field => <label className="grid gap-2 text-sm" key={field}>{t(field)}<input className={barnInput} required={field === 'name'} maxLength={field === 'name' ? 100 : 150} value={form[field]} disabled={busy} onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))} /></label>)}
      <label className="grid gap-2 text-sm">{t('notes')}<textarea className={`${barnInput} min-h-24`} maxLength={2000} value={form.notes} disabled={busy} onChange={event => setForm(current => ({ ...current, notes: event.target.value }))} /></label>
      <div className="flex flex-wrap gap-3"><button className={barnPrimary} disabled={busy}>{t(busy ? 'saving' : 'create')}</button><button type="button" className={barnButton} disabled={busy} onClick={() => setForm(null)}>{t('cancel')}</button></div>
    </form>}
    {!items ? !error && <p role="status">{t('loading')}</p> : !items.length ? <p className="text-muted py-8">{t('empty')}</p> : <ul className="divide-y divide-line">{items.map(item => <li key={item.id}><Link className="block py-6 min-w-0 hover:text-accent" to={`/barns/${item.id}`}><div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-semibold wrap-anywhere">{item.name}</h2><span className="text-sm text-muted">{t(item.archived ? 'archived' : 'active')}</span></div><p className="text-sm text-muted mt-2 wrap-anywhere">{item.location}</p><p className="text-sm mt-2">{t('cattle')}: <bdi>{item._count.memberships}</bdi> · {barnText(language, 'records', { count: item._count.entries })}</p></Link></li>)}</ul>}
  </section>
}
