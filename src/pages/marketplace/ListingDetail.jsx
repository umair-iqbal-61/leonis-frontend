import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { marketText, formatPrice, marketButton, marketPrimary } from '../../lib/marketplace'

export default function ListingDetail() {
  const { id } = useParams()
  const { language } = useLanguage()
  const t = (key, params) => marketText(language, key, params)
  const [item, setItem] = useState(null)
  const [error, setError] = useState(false)
  const [photo, setPhoto] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(`/listings/${id}`, { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) { setItem(data); setPhoto(0); setError(false) }
    }).catch(() => { if (!controller.signal.aborted) setError(true) })
    return () => controller.abort()
  }, [id])
  if (error) return <p role="alert">{t('unavailable')} <Link className="underline" to="/marketplace">{t('back')}</Link></p>
  if (!item) return <p role="status">{t('loading')}</p>
  const message = t('whatsappMessage', { title: item.title }) + ' ' + window.location.href
  return <article className="animate-workspace-enter motion-reduce:animate-none min-w-0">
    <Link className="inline-flex min-h-11 items-center text-muted text-sm mb-5" to="/marketplace">{t('back')}</Link>
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 items-start">
      <div className="min-w-0">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-line bg-surface flex items-center justify-center">
          {item.photos[photo] ? <img className="h-full w-full object-cover" src={item.photos[photo].url} alt={t('photoAlt', { number: photo + 1 })} /> : <p className="text-muted">{t('noPhoto')}</p>}
        </div>
        {item.photos.length > 1 && <div className="flex flex-wrap gap-3 mt-4">{item.photos.map((image, index) => <button className={`h-18 w-18 rounded-xl overflow-hidden border-2 ${photo === index ? 'border-accent' : 'border-transparent'}`} key={image.id} onClick={() => setPhoto(index)} aria-pressed={photo === index} aria-label={t('photoAlt', { number: index + 1 })}><img src={image.url} className="h-full w-full object-cover" alt="" /></button>)}</div>}
      </div>
      <div className="min-w-0">
        <p className="text-muted text-sm">{recordText(language, item.species)} · {item.location}</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-3 wrap-anywhere">{item.title}</h1>
        <p className="text-2xl text-accent font-semibold my-6"><bdi>{formatPrice(item.price, language)}</bdi></p>
        <dl className="grid grid-cols-2 gap-5 py-5 border-y border-line">
          {['breed', 'age'].map(field => <div key={field}><dt className="text-muted text-sm">{t(field)}</dt><dd className="mt-1 wrap-anywhere">{item[field] ?? t('unknown')}</dd></div>)}
        </dl>
        <h2 className="text-lg font-semibold mt-7">{t('details')}</h2><p className="mt-3 whitespace-pre-wrap wrap-anywhere leading-relaxed">{item.description}</p>
        <section className="mt-8 border-t border-line pt-6">
          <h2 className="text-lg font-semibold">{t('contact')}</h2>
          {item.status === 'SOLD' ? <p role="status" className="mt-3 text-muted">{t('soldHint')}</p> : <>
            <div className="flex flex-wrap gap-3 mt-4 [&>a]:flex-1 [&>a]:min-w-36">
              <a className={marketPrimary} href={`tel:${item.phone}`}>{t('call')}</a>
              <a className={marketButton} href={`https://wa.me/${item.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">{t('message')}</a>
            </div>
            <p className="mt-4 text-sm text-muted" dir="ltr"><bdi>{item.phone}</bdi></p>
          </>}
          <p className="text-muted text-sm leading-relaxed mt-5">{t('sellerEntered')}</p>
        </section>
      </div>
    </div>
  </article>
}
