import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { useCart } from '../../hooks/useCart'
import { storeText, storeInput, storeButton, storePrimary, formatPrice, storeError, storeProvinces } from '../../lib/store'
export default function Cart({ session }) {
  const { language } = useLanguage(), cart = useCart(), navigate = useNavigate()
  const t = key => storeText(language, key)
  const key = JSON.stringify(cart.items)
  const [loaded, setLoaded] = useState(null), [review, setReview] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [consent, setConsent] = useState(false)
  const [address, setAddress] = useState({ recipientName: '', phone: '', address: '', city: '', province: 'Punjab', postalCode: '' })
  const requestId = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    const items = JSON.parse(key)
    Promise.all(items.map(async item => {
      try { const { data } = await apiFetch(`/store/products/${item.productId}`, { signal: controller.signal }); return { ...item, product: data } }
      catch { return { ...item, product: null } }
    })).then(items => { if (!controller.signal.aborted) setLoaded({ key, items }) })
    return () => controller.abort()
  }, [key])
  const quote = review?.key === key ? review.data : null
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try {
      if (!quote) {
        const { data } = await apiFetch('/store/checkout/preview', { method: 'POST', body: JSON.stringify({ items: cart.items }) })
        let intent
        try { intent = JSON.parse(sessionStorage.getItem('leonis-checkout-intent')) } catch { /* Start a new intent if stale browser data cannot be read. */ }
        requestId.current = intent?.quoteId === data.quoteId ? intent.requestId : crypto.randomUUID()
        sessionStorage.setItem('leonis-checkout-intent', JSON.stringify({ quoteId: data.quoteId, requestId: requestId.current }))
        setReview({ key, data }); setConsent(false)
      } else {
        if (!consent) return
        const { data } = await apiFetch('/store/orders', { method: 'POST', body: JSON.stringify({ ...address, items: cart.items, quoteId: quote.quoteId, requestId: requestId.current, consent }) })
        sessionStorage.removeItem('leonis-checkout-intent'); cart.clear(); navigate(`/store/orders/${data.id}`)
      }
    } catch (error) {
      const code = storeError(error); setError(code)
      if (['QUOTE_CHANGED', 'STOCK_CHANGED', 'CHECKOUT_CLOSED'].includes(code)) { setReview(null); setConsent(false) }
    } finally { setBusy(false) }
  }
  if (!cart.items.length) return <div><h1 className="text-3xl font-semibold">{t('cart')}</h1><p className="my-6 text-muted">{t('emptyCart')}</p><Link className={storePrimary} to="/store">{t('browse')}</Link></div>
  return <div className="max-w-220 mx-auto min-w-0">
    <h1 className="text-3xl font-semibold mb-7">{t('cart')}</h1>
    {loaded?.key !== key ? <p role="status">{t('loading')}</p> : <ul className="divide-y divide-line mb-8">{loaded.items.map(item => <li key={item.productId} className="flex gap-4 py-5 min-w-0 items-start">
      {item.product?.photos[0] && <img className="w-18 h-18 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0" src={item.product.photos[0].url} alt="" />}
      <div className="flex-1 min-w-0"><h2 className="text-lg font-semibold wrap-anywhere">{item.product ? <Link to={`/store/products/${item.productId}`}>{item.product.name}</Link> : t('unavailable')}</h2>
        {item.product ? <p className="text-accent mt-1"><bdi>{formatPrice(item.product.price, language)}</bdi></p> : <p className="text-sm text-muted">{t('productUnavailable')}</p>}
        <div className="flex flex-wrap items-end gap-3 mt-3">
          <label className="grid gap-1 text-xs">{t('quantity')}<input className={`${storeInput} max-w-24`} type="number" min="1" max="99" step="1" value={item.quantity} disabled={busy} onChange={event => { cart.quantity(item.productId, Number(event.target.value)); setConsent(false) }} /></label>
          <button className={storeButton} disabled={busy} onClick={() => { cart.remove(item.productId); setConsent(false) }}>{t('remove')}</button>
        </div>
      </div>
    </li>)}</ul>}
    {!session ? <Link className={storePrimary} to="/login">{storeText(language, 'checkout')} · {language === 'ur' ? 'لاگ ان کریں' : 'Log in'}</Link> : <form onSubmit={submit} className="border-t border-line pt-7 grid gap-5">
      <h2 className="text-xl font-semibold">{t('checkout')}</h2><p className="text-muted text-sm">{t('country')}</p>
      <fieldset disabled={busy} className="grid sm:grid-cols-2 gap-5 min-w-0">
        {['recipientName', 'phone', 'city', 'postalCode'].map(field => <div key={field} className="min-w-0"><label className="grid gap-2 text-sm">{t(field)}<input className={storeInput} aria-describedby={field === 'phone' ? 'checkout-phone-hint' : undefined} required={field !== 'postalCode'} type={field === 'phone' ? 'tel' : 'text'} maxLength={field === 'postalCode' ? 5 : field === 'phone' ? 40 : 100} pattern={field === 'postalCode' ? '[0-9]{5}' : undefined} dir={['phone', 'postalCode'].includes(field) ? 'ltr' : undefined} autoComplete={{ recipientName: 'name', phone: 'tel', city: 'address-level2', postalCode: 'postal-code' }[field]} value={address[field]} onChange={event => setAddress(current => ({ ...current, [field]: event.target.value }))} /></label>{field === 'phone' && <p id="checkout-phone-hint" className="text-xs text-muted mt-2">{t('phoneHint')}</p>}</div>)}
        <label className="grid gap-2 text-sm min-w-0">{t('province')}<select className={storeInput} value={address.province} onChange={event => setAddress(current => ({ ...current, province: event.target.value }))}>{storeProvinces.map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label>
        <label className="grid gap-2 text-sm sm:col-span-2">{t('address')}<textarea className={`${storeInput} min-h-24 resize-y`} required maxLength={500} autoComplete="street-address" value={address.address} onChange={event => setAddress(current => ({ ...current, address: event.target.value }))} /></label>
      </fieldset>
      {error && <p role="alert" className="text-rose-700 dark:text-rose-300">{t(error)}</p>}
      {quote && <section className="border-y border-line py-6 space-y-5" aria-label={t('review')}>
        <dl className="space-y-3">{['subtotal', 'shippingFee', 'total'].map(field => <div key={field} className="flex flex-wrap justify-between gap-3"><dt className={field === 'total' ? 'font-semibold' : 'text-muted'}>{t({ subtotal: 'subtotal', shippingFee: 'shipping', total: 'total' }[field])}</dt><dd className="font-semibold"><bdi>{quote[field] === null ? t('pending') : formatPrice(quote[field], language)}</bdi></dd></div>)}</dl>
        {quote.deliveryMode === 'QUOTE' && <p className="text-sm text-muted leading-relaxed">{t('quoteNotice')}</p>}
        <label className="flex items-start gap-3 text-sm leading-relaxed"><input className="mt-1 h-5 w-5 shrink-0 accent-violet-700" type="checkbox" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} />{t(quote.deliveryMode === 'QUOTE' ? 'quoteConsent' : 'standardConsent')}</label>
      </section>}
      <div><button className={storePrimary} disabled={busy || (quote && !consent) || loaded?.key !== key || loaded.items.some(item => !item.product)}>{t(busy ? 'submitting' : quote ? 'place' : 'review')}</button></div>
    </form>}
  </div>
}
