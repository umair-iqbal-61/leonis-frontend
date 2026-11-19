import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { storeText, storeInput, storePrimary, storeError } from '../../lib/store'
export default function StoreSettings() {
  const { language } = useLanguage(), t = key => storeText(language, key)
  const [form, setForm] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [saved, setSaved] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/store/admin/settings', { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) setForm({ standardFee: data.standardFee ?? '', standardWeightLimitGrams: data.standardWeightLimitGrams ?? '', checkoutEnabled: data.checkoutEnabled }) })
      .catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [])
  return <section className="max-w-180"><h1 className="text-3xl font-semibold">{t('settings')}</h1><p className="text-muted leading-relaxed mt-3">{t('setup')}</p>
    {error && <p role="alert" className="text-rose-700 dark:text-rose-300 my-5">{t(error)}</p>}
    {!form ? !error && <p role="status" className="mt-5">{t('loading')}</p> : <form className="grid gap-5 mt-8" onSubmit={async event => {
      event.preventDefault(); if (busy) return; setBusy(true); setError(''); setSaved(false)
      try { await apiFetch('/store/admin/settings', { method: 'PUT', body: JSON.stringify({ ...form, standardWeightLimitGrams: Number(form.standardWeightLimitGrams) }) }); setSaved(true) }
      catch (error) { setError(storeError(error)) } finally { setBusy(false) }
    }}>
      <label className="grid gap-2 text-sm">{t('fee')}<input className={storeInput} type="number" min="0" max="9999999.99" step="0.01" required disabled={busy} value={form.standardFee} onChange={event => { setForm(current => ({ ...current, standardFee: event.target.value })); setSaved(false) }} /></label>
      <label className="grid gap-2 text-sm">{t('limit')}<input className={storeInput} type="number" min="1" max="1000000" step="1" required disabled={busy} value={form.standardWeightLimitGrams} onChange={event => { setForm(current => ({ ...current, standardWeightLimitGrams: event.target.value })); setSaved(false) }} /></label>
      <label className="flex gap-3 items-start text-sm"><input className="h-5 w-5 shrink-0 accent-violet-700" type="checkbox" disabled={busy} checked={form.checkoutEnabled} onChange={event => { setForm(current => ({ ...current, checkoutEnabled: event.target.checked })); setSaved(false) }} />{t('enabled')}</label>
      <div><button className={storePrimary} disabled={busy}>{t(busy ? 'saving' : 'save')}</button></div>
      {saved && <p role="status" className="text-accent">{t('saved')}</p>}
    </form>}
  </section>
}
