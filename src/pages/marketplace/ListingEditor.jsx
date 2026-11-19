import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { marketText, marketSpecies, marketInput, marketButton, marketPrimary } from '../../lib/marketplace'

const blank = { title: '', description: '', species: 'dairy-cattle', breed: '', age: '', price: '', location: '', phone: '', whatsapp: '' }
export default function ListingEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key, params) => marketText(language, key, params)
  const [form, setForm] = useState(blank)
  const [item, setItem] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [consent, setConsent] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [retry, setRetry] = useState(0)
  const fileRef = useRef(null)
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    apiFetch(`/listings/mine/${id}`, { signal: controller.signal }).then(({ data }) => {
      if (controller.signal.aborted) return
      setItem(data)
      setForm(Object.fromEntries(Object.keys(blank).map(key => [key, data[key] ?? ''])))
      setLoadedId(id); setDirty(false); setConsent(false); setError(''); setNotice('')
    }).catch(() => { if (!controller.signal.aborted) setError('unavailable') })
    return () => controller.abort()
  }, [id, retry])
  const update = key => event => { setForm(current => ({ ...current, [key]: event.target.value })); setDirty(true); setConsent(false); setNotice('') }
  async function action(operation) {
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try { await operation() } catch { setError('failed') } finally { setBusy(false) }
  }
  function save(event) {
    event.preventDefault()
    action(async () => {
      const { data } = await apiFetch(id ? `/listings/mine/${id}` : '/listings', { method: id ? 'PATCH' : 'POST', body: JSON.stringify(form) })
      setItem(data); setDirty(false); setConsent(false); setNotice('saved')
      if (!id) navigate(`/marketplace/mine/${data.id}`, { replace: true })
    })
  }
  async function upload(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('invalidPhoto'); return }
    await action(async () => {
      const body = new FormData(); body.append('photo', file)
      const { data } = await apiFetch(`/listings/mine/${id}/photos`, { method: 'POST', body })
      setItem(current => ({ ...current, photos: [...current.photos, data] })); setConsent(false)
    })
  }
  function status(value) {
    if (value === 'SOLD' && !window.confirm(t('soldConfirm'))) return
    action(async () => {
      const { data } = await apiFetch(`/listings/mine/${id}/status`, { method: 'POST', body: JSON.stringify({ status: value }) })
      setItem(data); setConsent(false)
    })
  }
  const input = (key, props = {}) => <label className="grid gap-2 min-w-0 text-sm">{t(key)}<input className={marketInput} value={form[key]} onChange={update(key)} {...props} /></label>
  if (id && loadedId !== id) return error ? <div role="alert"><p>{t(error)}</p><button className={`${marketButton} mt-4`} onClick={() => setRetry(value => value + 1)}>{t('retry')}</button></div> : <p role="status">{t('loading')}</p>
  return <section className="max-w-190 mx-auto min-w-0 animate-workspace-enter motion-reduce:animate-none">
    <Link to="/marketplace/mine" className="min-h-11 inline-flex items-center text-muted text-sm mb-5">{t('back')}</Link>
    <div className="flex flex-wrap items-baseline justify-between gap-3"><h1 className="text-3xl font-semibold">{t(id ? 'edit' : 'newListing')}</h1>{item && <span className="text-accent font-semibold text-sm">{t(item.status)}</span>}</div>
    <p className="mt-3 text-muted leading-relaxed">{t('draftIntro')}</p>
    <p className="mt-3 text-sm text-muted leading-relaxed">{t('privacy')}</p>
    {error && <p role="alert" className="my-5 border-s-2 border-rose-600 ps-4 text-rose-700 dark:text-rose-300">{t(error)}</p>}
    {notice && <p role="status" className="my-5 text-accent">{t(notice)}</p>}
    <form onSubmit={save} className="mt-8 grid gap-5">
      <fieldset disabled={busy} className="grid gap-5 min-w-0 disabled:opacity-70">
        <legend className="text-lg font-semibold mb-5">{t('listingDetails')}</legend>
        {input('title', { required: true, maxLength: 100 })}
        <div className="grid sm:grid-cols-2 gap-5 min-w-0">
          <label className="grid gap-2 min-w-0 text-sm">{t('species')}<select className={marketInput} value={form.species} onChange={update('species')}>{marketSpecies.map(value => <option key={value} value={value}>{recordText(language, value)}</option>)}</select></label>
          {input('breed', { maxLength: 100 })}
          {input('age', { type: 'number', min: 0, max: 200, step: 1, inputMode: 'numeric' })}
          {input('price', { type: 'number', required: true, min: 0.01, max: 9999999999.99, step: 0.01, inputMode: 'decimal' })}
        </div>
        {input('location', { required: true, maxLength: 100 })}
        <label className="grid gap-2 text-sm">{t('description')}<textarea className={`${marketInput} min-h-32 resize-y`} rows={5} required maxLength={3000} value={form.description} onChange={update('description')} /></label>
        <div className="border-t border-line pt-6 grid sm:grid-cols-2 gap-5">
          <div>{input('phone', { type: 'tel', required: true, maxLength: 40, autoComplete: 'tel', dir: 'ltr', 'aria-describedby': 'listing-phone-hint' })}<p id="listing-phone-hint" className="mt-2 text-xs text-muted">{t('phoneHint')}</p></div>
          <div>{input('whatsapp', { type: 'tel', maxLength: 40, dir: 'ltr', 'aria-describedby': 'listing-whatsapp-hint' })}<p id="listing-whatsapp-hint" className="mt-2 text-xs text-muted">{t('whatsappHint')}</p></div>
        </div>
      </fieldset>
      {item?.status === 'PUBLISHED' && <p className="text-sm text-muted">{t('withdrawHint')}</p>}
      <div><button className={marketPrimary} disabled={busy}>{t(busy ? 'saving' : id ? 'saveChanges' : 'saveDraft')}</button></div>
    </form>
    {!item ? <p className="text-sm text-muted mt-8">{t('saveFirst')}</p> : <>
      <section className="border-t border-line mt-10 pt-7">
        <h2 className="text-xl font-semibold">{t('photos')}</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">{t('photoHint')}</p><p className="text-sm text-muted mt-2 leading-relaxed">{t('photoPrivacy')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-5">
          {item.photos.map((photo, number) => <div key={photo.id} className="min-w-0">
            <img className="aspect-[4/3] w-full object-cover rounded-xl" src={photo.url} alt={t('photoAlt', { number: number + 1 })} />
            {item.status === 'DRAFT' && <button className={`${marketButton} mt-2 w-full`} disabled={busy} onClick={() => action(async () => {
              await apiFetch(`/listings/mine/${id}/photos/${photo.id}`, { method: 'DELETE' })
              setItem(current => ({ ...current, photos: current.photos.filter(image => image.id !== photo.id) })); setConsent(false)
            })}>{t('removePhoto')}</button>}
          </div>)}
        </div>
        {item.status === 'DRAFT' && <><input className="hidden" ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} aria-label={t('addPhoto')} disabled={busy} />
          <button className={marketButton} disabled={busy || item.photos.length >= 5} onClick={() => fileRef.current.click()}>{t('addPhoto')}</button></>}
      </section>
      <section className="border-t border-line mt-8 pt-7 space-y-4">
        {item.status === 'DRAFT' ? <>
          <p className="text-sm text-muted">{t('publishHint')}</p>
          <label className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-violet-700" checked={consent} disabled={busy || dirty || !item.photos.length} onChange={event => setConsent(event.target.checked)} />{t('consent')}</label>
          <button className={marketPrimary} disabled={busy || dirty || !consent || !item.photos.length} onClick={() => action(async () => {
            const { data } = await apiFetch(`/listings/mine/${id}/publish`, { method: 'POST', body: JSON.stringify({ consent }) })
            setItem(data); setConsent(false); setNotice('publishSuccess')
          })}>{t('publish')}</button>
        </> : <div className="flex flex-wrap gap-3">
          <Link className={marketPrimary} to={`/marketplace/${id}`}>{t('view')}</Link>
          {item.status === 'PUBLISHED' && <button className={marketButton} disabled={busy} onClick={() => status('SOLD')}>{t('sold')}</button>}
          <button className={marketButton} disabled={busy} onClick={() => status('DRAFT')}>{t('withdraw')}</button>
        </div>}
        <div className="pt-5"><button className={`${marketButton} text-rose-700 dark:text-rose-300`} disabled={busy} onClick={() => {
          if (window.confirm(t('deleteConfirm'))) action(async () => { await apiFetch(`/listings/mine/${id}`, { method: 'DELETE' }); navigate('/marketplace/mine') })
        }}>{t('remove')}</button></div>
      </section>
    </>}
  </section>
}
