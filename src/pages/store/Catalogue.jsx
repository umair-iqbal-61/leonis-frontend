import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { useCart } from '../../hooks/useCart'
import { recordText } from '../../lib/recordLanguage'
import { marketSpecies } from '../../lib/marketplace'
import { storeText, storeCategories, storeInput, storeButton, storePrimary, formatPrice, storeError } from '../../lib/store'
export default function Catalogue() {
  const { language } = useLanguage(), { add } = useCart()
  const t = (key, params) => storeText(language, key, params)
  const [params, setParams] = useSearchParams(), query = params.toString()
  const [result, setResult] = useState(null), [settings, setSettings] = useState(null), [error, setError] = useState(''), [notice, setNotice] = useState(''), [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([apiFetch(`/store/products?${query}`, { signal: controller.signal }), apiFetch('/store/settings', { signal: controller.signal })])
      .then(([data, config]) => { if (!controller.signal.aborted) { setResult({ ...data, query }); setSettings(config.data); setError('') } })
      .catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [query, retry])
  const page = Number(params.get('page') || 1), ready = result?.query === query
  return <section className="animate-workspace-enter motion-reduce:animate-none">
    <h1 className="text-3xl md:text-4xl font-semibold">{t('store')}</h1><p className="mt-2 text-muted">{t('intro')}</p>
    {settings && <p className="mt-4 text-sm text-muted leading-relaxed">{!settings.checkoutEnabled ? t('closed') : t('standardNotice', { weight: settings.standardWeightLimitGrams / 1000, fee: formatPrice(settings.standardFee, language) })}</p>}
    <form key={query} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] items-end my-8 border-b border-line pb-8" onSubmit={event => {
      event.preventDefault(); const fields = new FormData(event.currentTarget), next = {}
      for (const field of ['search', 'species', 'category']) if (fields.get(field)?.trim()) next[field] = fields.get(field).trim()
      setParams(next); setRetry(value => value + 1)
    }}>
      <label className="grid gap-2 text-sm min-w-0">{t('search')}<input className={storeInput} name="search" maxLength={100} defaultValue={params.get('search') || ''} /></label>
      <label className="grid gap-2 text-sm min-w-0">{t('species')}<select className={storeInput} name="species" defaultValue={params.get('species') || ''}><option value="">{t('allSpecies')}</option>{marketSpecies.map(value => <option key={value} value={value}>{recordText(language, value)}</option>)}</select></label>
      <label className="grid gap-2 text-sm min-w-0">{t('category')}<select className={storeInput} name="category" defaultValue={params.get('category') || ''}><option value="">{t('all')}</option>{storeCategories.map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label>
      <button className={storeButton}>{t('filter')}</button>
    </form>
    {notice && <p role="status" className="text-accent mb-5">{t(notice)}</p>}
    {error ? <div role="alert"><p>{t(error)}</p><button className={`${storeButton} mt-3`} onClick={() => setRetry(value => value + 1)}>{t('reload')}</button></div>
      : !ready ? <p role="status">{t('loading')}</p> : !result.data.length ? <p className="py-10 text-muted">{t('empty')}</p>
      : <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{result.data.map(product => <article key={product.id} className="min-w-0">
        <Link to={`/store/products/${product.id}`} className="group block">
          <div className="aspect-[4/3] rounded-2xl bg-surface overflow-hidden border border-line">{product.photos[0] && <img className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transform-none" src={product.photos[0].url} alt={product.name} loading="lazy" />}</div>
          <p className="text-accent font-semibold mt-4"><bdi>{formatPrice(product.price, language)}</bdi></p><h2 className="text-xl font-semibold mt-1 wrap-anywhere group-hover:text-accent">{product.name}</h2>
        </Link>
        <p className="text-sm text-muted mt-2">{t(product.category)} · <bdi>{product.weightGrams / 1000} kg</bdi></p>
        {product.requiresQuote && <p className="text-sm text-muted mt-2">{t('quoteItem')}</p>}
        <button className={`${storePrimary} mt-4`} disabled={!product.stock} onClick={() => setNotice(add(product.id) ? 'added' : 'fullCart')}>{t(product.stock ? 'add' : 'outOfStock')}</button>
      </article>)}</div>}
    {ready && result.total > 20 && <nav className="mt-10 flex items-center justify-between gap-3" aria-label={t('page', { page })}>
      <button className={storeButton} disabled={page <= 1} onClick={() => setParams({ ...Object.fromEntries(params), page: page - 1 })}>{t('prev')}</button><span>{t('page', { page })}</span>
      <button className={storeButton} disabled={page * 20 >= result.total} onClick={() => setParams({ ...Object.fromEntries(params), page: page + 1 })}>{t('next')}</button>
    </nav>}
  </section>
}
