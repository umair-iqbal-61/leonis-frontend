import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { storeText, storeButton, storePrimary, storeInput, formatPrice, storeError } from '../../lib/store'
const nextStates = { PENDING: ['CONFIRMED', 'CANCELLED'], AWAITING_QUOTE: ['CANCELLED'], AWAITING_ACCEPTANCE: ['CANCELLED'], CONFIRMED: ['SHIPPED', 'CANCELLED'], SHIPPED: ['DELIVERED'] }
export default function OrderDetail({ admin = false }) {
  const { id } = useParams(), { language } = useLanguage(), t = (key, params) => storeText(language, key, params)
  const [order, setOrder] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [consent, setConsent] = useState(false), [fee, setFee] = useState(''), [retry, setRetry] = useState(0)
  const base = admin ? '/store/admin/orders' : '/store/orders'
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(`${base}/${id}`, { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) { setOrder(data); setError(''); setConsent(false); setFee(data.shippingFee ?? '') } })
      .catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [base, id, retry])
  async function action(path, body) {
    if (busy) return
    setBusy(true); setError('')
    try {
      const { data } = await apiFetch(`${base}/${id}/${path}`, { method: 'POST', body: JSON.stringify(body) })
      setOrder(data); setConsent(false)
    } catch (error) { setError(storeError(error)); setConsent(false) }
    finally { setBusy(false) }
  }
  if (!order) return error ? <p role="alert">{t(error)}</p> : <p role="status">{t('loading')}</p>
  return <article className="max-w-220 mx-auto min-w-0">
    <Link className="inline-flex min-h-11 items-center text-sm text-muted mb-5" to={admin ? '/store/admin/orders' : '/store/orders'}>{t('backOrders')}</Link>
    <h1 className="text-3xl font-semibold">{t('order', { id })}</h1><p className="text-accent font-semibold mt-3">{t(order.status)}</p><p className="text-muted text-sm mt-2">{t('orderHint')}</p>
    {error && <div role="alert" className="mt-5 text-rose-700 dark:text-rose-300"><p>{t(error)}</p><button className={`${storeButton} mt-3`} onClick={() => setRetry(value => value + 1)}>{t('reload')}</button></div>}
    <ul className="divide-y divide-line mt-7">{order.items.map(item => <li key={item.id} className="py-4 flex flex-wrap justify-between gap-3"><div><h2 className="font-medium wrap-anywhere">{item.name}</h2><p className="text-muted text-sm mt-1"><bdi>{item.quantity} × {formatPrice(item.unitPrice, language)}</bdi></p></div><p><bdi>{formatPrice(item.lineTotal, language)}</bdi></p></li>)}</ul>
    <dl className="border-y border-line py-6 space-y-3 mt-3">{['subtotal', 'shippingFee', 'total'].map(field => <div key={field} className="flex flex-wrap justify-between gap-3"><dt className={field === 'total' ? 'font-semibold' : 'text-muted'}>{t({ subtotal: 'subtotal', shippingFee: 'shipping', total: 'total' }[field])}</dt><dd className="font-semibold"><bdi>{order[field] === null ? t('pending') : formatPrice(order[field], language)}</bdi></dd></div>)}<div className="flex flex-wrap justify-between gap-3"><dt className="text-muted">{t('payment')}</dt><dd>{t('COD')}</dd></div></dl>
    <section className="mt-7"><h2 className="text-xl font-semibold">{t('checkout')}</h2><address className="not-italic leading-relaxed mt-3 wrap-anywhere"><p>{order.recipientName}</p><p><bdi>{order.phone}</bdi></p><p className="whitespace-pre-wrap">{order.address}</p><p>{order.city} · {t(order.province)} {order.postalCode}</p><p>{t('country')}</p></address></section>
    {!admin && order.status === 'AWAITING_ACCEPTANCE' && <section className="mt-8 border-t border-line pt-6 space-y-4"><p className="text-muted text-sm">{t('acceptHint')}</p><label className="flex gap-3 items-start text-sm"><input className="h-5 w-5 shrink-0 accent-violet-700" type="checkbox" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} />{t('acceptConsent')}</label><button className={storePrimary} disabled={busy || !consent} onClick={() => action('accept', { consent, quoteVersion: order.quoteVersion })}>{t('accept')}</button></section>}
    {admin && ['AWAITING_QUOTE', 'AWAITING_ACCEPTANCE'].includes(order.status) && <form className="mt-8 border-t border-line pt-6 grid gap-4 sm:grid-cols-[1fr_auto] items-end" onSubmit={event => { event.preventDefault(); action('quote', { shippingFee: fee }) }}><label className="grid gap-2 text-sm">{t('quoteFee')}<input className={storeInput} type="number" min="0" max="9999999.99" step="0.01" required value={fee} disabled={busy} onChange={event => setFee(event.target.value)} /></label><button className={storePrimary} disabled={busy}>{t('sendQuote')}</button></form>}
    <div className="flex flex-wrap gap-3 mt-7">
      {admin ? (nextStates[order.status] ?? []).map(status => <button key={status} className={status === 'CANCELLED' ? storeButton : storePrimary} disabled={busy} onClick={() => { if (status !== 'CANCELLED' || window.confirm(t('cancelConfirm'))) action('status', { status }) }}>{t(status)}</button>)
        : ['PENDING', 'AWAITING_QUOTE', 'AWAITING_ACCEPTANCE'].includes(order.status) && <button className={storeButton} disabled={busy} onClick={() => { if (window.confirm(t('cancelConfirm'))) action('cancel', {}) }}>{t(order.status === 'AWAITING_ACCEPTANCE' ? 'reject' : 'cancel')}</button>}
    </div>
  </article>
}
