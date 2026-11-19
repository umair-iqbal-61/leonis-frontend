import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { marketText, marketSpecies, marketButton, marketPrimary, marketInput } from '../../lib/marketplace'
import ListingCard from '../../components/ListingCard'

export default function Marketplace({ owner = false }) {
  const { language } = useLanguage()
  const t = (key, params) => marketText(language, key, params)
  const [search, setSearch] = useSearchParams()
  const query = search.toString()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(owner ? '/listings/mine' : `/listings?${query}`, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) { setResult(data); setError(false) } })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
    return () => controller.abort()
  }, [query, owner, retry])
  function filter(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next = {}
    if (data.get('species')) next.species = data.get('species')
    if (data.get('location').trim()) next.location = data.get('location').trim()
    setResult(null); setError(false); setSearch(next); setRetry(value => value + 1)
  }
  const page = Number(search.get('page') || 1)
  return <section className="animate-workspace-enter motion-reduce:animate-none">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div><h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t(owner ? 'myListings' : 'marketplace')}</h1>
        {!owner && <p className="mt-2 text-muted">{t('browseIntro')}</p>}</div>
      <Link className={marketPrimary} to="/marketplace/new">{t('newListing')}</Link>
    </div>
    {!owner && <form onSubmit={filter} key={query} className="grid sm:grid-cols-[1fr_1fr_auto] items-end gap-4 pb-8 mb-8 border-b border-line">
      <label className="grid min-w-0 gap-2 text-sm">{t('species')}
        <select className={marketInput} name="species" defaultValue={search.get('species') || ''}>
          <option value="">{t('allSpecies')}</option>{marketSpecies.map(species => <option key={species} value={species}>{recordText(language, species)}</option>)}
        </select>
      </label>
      <label className="grid min-w-0 gap-2 text-sm">{t('location')}<input className={marketInput} name="location" maxLength={100} defaultValue={search.get('location') || ''} /></label>
      <button className={marketButton}>{t('filter')}</button>
    </form>}
    {error ? <div role="alert"><p>{t('failed')}</p><button className={`${marketButton} mt-4`} onClick={() => setRetry(value => value + 1)}>{t('retry')}</button></div>
      : !result ? <p role="status">{t('loading')}</p>
      : result.data.length === 0 ? <div className="py-12"><h2 className="text-xl font-medium">{t('noListings')}</h2><p className="mt-2 text-muted">{t(owner ? 'noMine' : 'noListingsHint')}</p></div>
      : <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{result.data.map(item => <ListingCard key={item.id} item={item} owner={owner} />)}</div>}
    {!owner && result && result.total > 20 && <nav className="flex items-center justify-between gap-3 mt-10" aria-label={t('page', { page })}>
      <button className={marketButton} disabled={page <= 1} onClick={() => { setResult(null); setSearch({ ...Object.fromEntries(search), page: page - 1 }) }}>{t('previous')}</button>
      <span className="text-sm">{t('page', { page })}</span>
      <button className={marketButton} disabled={page * 20 >= result.total} onClick={() => { setResult(null); setSearch({ ...Object.fromEntries(search), page: page + 1 }) }}>{t('next')}</button>
    </nav>}
  </section>
}
