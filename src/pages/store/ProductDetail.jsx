import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { useCart } from '../../hooks/useCart'
import { storeText, storeButton, storePrimary, formatPrice, storeError } from '../../lib/store'
export default function ProductDetail() {
  const { id } = useParams(), { language } = useLanguage(), { add } = useCart()
  const t = (key, params) => storeText(language, key, params)
  const [item, setItem] = useState(null), [error, setError] = useState(''), [notice, setNotice] = useState(''), [photo, setPhoto] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(`/store/products/${id}`, { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) setItem(data) })
      .catch(error => { if (!controller.signal.aborted) setError(storeError(error)) })
    return () => controller.abort()
  }, [id])
  if (error) return <p role="alert">{t(error)} <Link className="underline" to="/store">{t('browse')}</Link></p>
  if (!item) return <p role="status">{t('loading')}</p>
  return <article className="min-w-0 animate-workspace-enter motion-reduce:animate-none">
    <Link className="inline-flex min-h-11 items-center text-muted text-sm mb-5" to="/store">{t('browse')}</Link>
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      <div className="min-w-0"><div className="aspect-[4/3] rounded-2xl overflow-hidden border border-line bg-surface">{item.photos[photo] && <img className="h-full w-full object-cover" src={item.photos[photo].url} alt={item.name} />}</div>
        <div className="mt-4 flex gap-3 flex-wrap">{item.photos.length > 1 && item.photos.map((image, index) => <button key={image.id} className={`w-18 h-18 rounded-xl overflow-hidden border-2 ${photo === index ? 'border-accent' : 'border-transparent'}`} aria-label={t('photoAlt', { number: index + 1 })} aria-pressed={photo === index} onClick={() => setPhoto(index)}><img className="h-full w-full object-cover" src={image.url} alt="" /></button>)}</div>
      </div>
      <div className="min-w-0"><p className="text-muted text-sm">{t(item.category)}</p><h1 className="text-3xl font-semibold mt-3 wrap-anywhere">{item.name}</h1><p className="text-2xl text-accent font-semibold my-5"><bdi>{formatPrice(item.price, language)}</bdi></p>
        <p className="whitespace-pre-wrap wrap-anywhere leading-relaxed">{item.description}</p><p className="text-muted mt-5">{t('weight')}: <bdi>{item.weightGrams / 1000} kg</bdi></p><p className="text-sm text-muted mt-2">{t(item.requiresQuote ? 'quoteItem' : 'standardItem')}</p>
        <div className="flex gap-3 flex-wrap mt-7"><button className={storePrimary} disabled={!item.stock} onClick={() => setNotice(add(item.id) ? 'added' : 'fullCart')}>{t(item.stock ? 'add' : 'outOfStock')}</button><Link className={storeButton} to="/store/cart">{t('cart')}</Link></div>
        {notice && <p role="status" className="mt-4 text-accent">{t(notice)}</p>}
      </div>
    </div>
  </article>
}
