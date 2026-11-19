import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { marketSpecies } from '../../lib/marketplace'
import { recordText } from '../../lib/recordLanguage'
import { storeText, storeInput, storeButton, storePrimary, storeCategories, storeError } from '../../lib/store'
const blank = { name: '', description: '', category: 'OTHER', species: [], price: '', stock: '', weightGrams: '', requiresQuote: false, active: false }
export default function ProductEditor() {
  const { id } = useParams(), { language } = useLanguage(), navigate = useNavigate(), t = (key, params) => storeText(language, key, params)
  const [form, setForm] = useState(blank), [item, setItem] = useState(null), [loadedId, setLoadedId] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [saved, setSaved] = useState(false), [retry, setRetry] = useState(0)
  const uploadRef = useRef(null)
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    apiFetch(`/store/admin/products/${id}`, { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) { setItem(data); setForm(Object.fromEntries(Object.keys(blank).map(key => [key, data[key]]))); setLoadedId(id); setError(''); setSaved(false) }
    }).catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [id, retry])
  const update = key => event => { setForm(current => ({ ...current, [key]: event.target.value })); setSaved(false) }
  async function action(fn) {
    if (busy) return
    setBusy(true); setError(''); setSaved(false)
    try { await fn() } catch (error) { setError(storeError(error)) } finally { setBusy(false) }
  }
  const input = (key, props = {}) => <label className="grid gap-2 text-sm min-w-0">{t(key)}<input className={storeInput} value={form[key]} onChange={update(key)} {...props} /></label>
  if (id && loadedId !== id) return error ? <p role="alert">{t(error)}</p> : <p role="status">{t('loading')}</p>
  return <section className="max-w-190 mx-auto min-w-0"><Link className="inline-flex min-h-11 text-sm text-muted items-center mb-4" to="/store/admin">{t('allProducts')}</Link><h1 className="text-3xl font-semibold">{t(id ? 'edit' : 'create')}</h1>
    {error && <div className="mt-5 text-rose-700 dark:text-rose-300" role="alert"><p>{t(error)}</p>{error === 'PRODUCT_CHANGED' && <button className={`${storeButton} mt-3`} onClick={() => setRetry(value => value + 1)}>{t('reload')}</button>}</div>}
    {saved && <p className="mt-5 text-accent" role="status">{t('saved')}</p>}
    <form className="mt-8 grid gap-5" onSubmit={event => {
      event.preventDefault(); action(async () => {
        const { data } = await apiFetch(id ? `/store/admin/products/${id}` : '/store/admin/products', { method: id ? 'PATCH' : 'POST', body: JSON.stringify({ ...form, stock: Number(form.stock), weightGrams: Number(form.weightGrams), expectedUpdatedAt: item?.updatedAt }) })
        if (!id) { navigate(`/store/admin/products/${data.id}`, { replace: true }); return }
        setItem(data); setForm(Object.fromEntries(Object.keys(blank).map(key => [key, data[key]]))); setSaved(true)
      })
    }}>
      <fieldset disabled={busy} className="grid gap-5 min-w-0">
        {input('name', { required: true, maxLength: 120 })}
        <label className="grid gap-2 text-sm">{t('description')}<textarea className={`${storeInput} min-h-28 resize-y`} required maxLength={4000} value={form.description} onChange={update('description')} /></label>
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="grid gap-2 text-sm min-w-0">{t('category')}<select className={storeInput} value={form.category} onChange={update('category')}>{storeCategories.map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label>
          {input('price', { type: 'number', required: true, min: 0.01, max: 9999999.99, step: 0.01 })}
          <div>{input('stock', { type: 'number', required: true, min: 0, max: 1000000, step: 1 })}<p className="text-xs text-muted mt-2">{t('stockHint')}</p></div>
          <div>{input('weightGrams', { type: 'number', required: true, min: 1, max: 1000000, step: 1 })}<p className="text-xs text-muted mt-2">{t('weightHint')}</p></div>
        </div>
        <fieldset className="border-y border-line py-5"><legend className="text-sm font-semibold">{t('species')}</legend><p className="text-sm text-muted mb-4">{t('speciesHint')}</p><div className="grid grid-cols-2 gap-3">{marketSpecies.map(value => <label className="flex gap-3 items-start text-sm min-h-11" key={value}><input className="h-5 w-5 shrink-0 accent-violet-700" type="checkbox" checked={form.species.includes(value)} onChange={event => { setForm(current => ({ ...current, species: event.target.checked ? [...current.species, value] : current.species.filter(item => item !== value) })); setSaved(false) }} />{recordText(language, value)}</label>)}</div></fieldset>
        <label className="flex gap-3 items-start text-sm"><input type="checkbox" className="h-5 w-5 shrink-0 accent-violet-700" checked={form.requiresQuote} onChange={event => { setForm(current => ({ ...current, requiresQuote: event.target.checked })); setSaved(false) }} />{t('requiresQuote')}</label>
        <label className="flex gap-3 items-start text-sm"><input type="checkbox" className="h-5 w-5 shrink-0 accent-violet-700" checked={form.active} disabled={!item?.photos.length} onChange={event => { setForm(current => ({ ...current, active: event.target.checked })); setSaved(false) }} />{t('active')}</label><p className="text-sm text-muted">{t('activeHint')}</p>
      </fieldset>
      <div><button className={storePrimary} disabled={busy}>{t(busy ? 'saving' : 'save')}</button></div>
    </form>
    <section className="border-t border-line pt-7 mt-9"><h2 className="text-xl font-semibold">{t('photos')}</h2><p className="text-sm text-muted mt-2">{t('photoHint')}</p>
      {!item ? <p className="text-sm text-muted mt-4">{t('saveFirst')}</p> : <>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">{item.photos.map((photo, index) => <div key={photo.id} className="min-w-0"><img className="aspect-[4/3] w-full object-cover rounded-xl" src={photo.url} alt={t('photoAlt', { number: index + 1 })} />{!item.active && <button className={`${storeButton} w-full mt-2`} disabled={busy} onClick={() => action(async () => { const { data } = await apiFetch(`/store/admin/products/${id}/photos/${photo.id}`, { method: 'DELETE' }); setItem(data) })}>{t('removePhoto')}</button>}</div>)}</div>
        {!item.active && <><input ref={uploadRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-label={t('addPhoto')} disabled={busy} onChange={event => {
          const file = event.target.files[0]; event.target.value = ''; if (!file) return
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('INVALID_PHOTO'); return }
          action(async () => { const body = new FormData(); body.append('photo', file); const { data } = await apiFetch(`/store/admin/products/${id}/photos`, { method: 'POST', body }); setItem(data) })
        }} /><button className={`${storeButton} mt-5`} disabled={busy || item.photos.length >= 5} onClick={() => uploadRef.current.click()}>{t('addPhoto')}</button></>}
      </>}
    </section>
  </section>
}
