import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { storeText, storeButton, formatPrice, storeError } from '../../lib/store'
export default function Orders({ admin = false }) {
  const { language } = useLanguage(), t = (key, params) => storeText(language, key, params)
  const [result, setResult] = useState(null), [error, setError] = useState(''), [page, setPage] = useState(1)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(admin ? `/store/admin/orders?page=${page}` : '/store/orders', { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) { setResult({ ...data, page }); setError('') } })
      .catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [admin, page])
  return <section><h1 className="text-3xl font-semibold mb-7">{t(admin ? 'allOrders' : 'orders')}</h1>
    {error ? <p role="alert">{t(error)}</p> : result?.page !== page ? <p role="status">{t('loading')}</p> : !result.data.length ? <p className="text-muted">{t('emptyOrders')}</p>
      : <ul className="divide-y divide-line">{result.data.map(order => <li key={order.id}><Link className="py-5 flex flex-wrap justify-between items-start gap-4 min-w-0" to={admin ? `/store/admin/orders/${order.id}` : `/store/orders/${order.id}`}>
        <div><h2 className="font-semibold text-accent">{t('order', { id: order.id })}</h2><p className="text-sm text-muted mt-1">{new Date(order.createdAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-PK')}</p><p className="text-sm mt-2">{t(order.status)}</p></div>
        <p className="font-semibold"><bdi>{order.total === null ? t('pending') : formatPrice(order.total, language)}</bdi></p>
      </Link></li>)}</ul>}
    {admin && result && result.total > 30 && <nav className="flex items-center justify-between gap-3 mt-7"><button className={storeButton} disabled={page <= 1} onClick={() => setPage(value => value - 1)}>{t('prev')}</button><span>{t('page', { page })}</span><button className={storeButton} disabled={page * 30 >= result.total} onClick={() => setPage(value => value + 1)}>{t('next')}</button></nav>}
  </section>
}
