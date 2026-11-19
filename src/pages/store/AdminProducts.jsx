import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { storeText, storePrimary, formatPrice, storeError } from '../../lib/store'
export default function AdminProducts() {
  const { language } = useLanguage(), t = key => storeText(language, key)
  const [items, setItems] = useState(null), [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/store/admin/products', { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) setItems(data) })
      .catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [])
  return <section><div className="flex flex-wrap items-center justify-between gap-4 mb-7"><h1 className="text-3xl font-semibold">{t('products')}</h1><Link className={storePrimary} to="/store/admin/products/new">{t('create')}</Link></div>
    {error ? <p role="alert">{t(error)}</p> : !items ? <p role="status">{t('loading')}</p> : !items.length ? <p className="text-muted">{t('empty')}</p> : <ul className="divide-y divide-line">{items.map(item => <li key={item.id}><Link className="flex flex-wrap justify-between gap-4 py-5 min-w-0" to={`/store/admin/products/${item.id}`}><div className="min-w-0"><h2 className="font-semibold text-accent wrap-anywhere">{item.name}</h2><p className="text-sm text-muted mt-1">{t(item.active ? 'activeLabel' : 'inactive')} · {t('stock')}: {item.stock}</p></div><p><bdi>{formatPrice(item.price, language)}</bdi></p></Link></li>)}</ul>}
  </section>
}
