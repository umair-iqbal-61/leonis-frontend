import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'
import { marketText, formatPrice } from '../lib/marketplace'

export default function ListingCard({ item, owner = false }) {
  const { language } = useLanguage()
  const t = key => marketText(language, key)
  return <article className="min-w-0">
    <Link to={owner ? `/marketplace/mine/${item.id}` : `/marketplace/${item.id}`} className="group block min-w-0">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface border border-line flex items-center justify-center text-muted text-sm">
        {item.photos[0] ? <img className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transform-none" src={item.photos[0].url} alt={item.title} loading="lazy" /> : <span>{t('noPhoto')}</span>}
      </div>
      <div className="flex flex-wrap justify-between items-baseline gap-2 mt-4">
        <p className="text-accent font-semibold"><bdi>{formatPrice(item.price, language)}</bdi></p>
        {owner && <span className="text-xs text-muted">{t(item.status)}</span>}
      </div>
      <h2 className="text-xl font-semibold mt-1 wrap-anywhere group-hover:text-accent">{item.title}</h2>
      <p className="text-sm text-muted mt-1 wrap-anywhere">{recordText(language, item.species)} · {item.location}</p>
    </Link>
  </article>
}
