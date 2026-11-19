import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { barnText, barnError, barnMoney, barnToday, barnInput, barnButton, barnPrimary } from '../../lib/barn'
function Content({ data, language, print = false }) {
  const t = (key, params) => barnText(language, key, params)
  const figures = (object, fields) => <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 py-5 border-y border-line print:grid-cols-3">{fields.map(([field, label]) => <div key={field} className="min-w-0"><dt className="text-sm text-muted">{t(label ?? field)}</dt><dd className="font-semibold text-lg mt-1 wrap-anywhere"><bdi>{barnMoney(object[field], language)}</bdi></dd></div>)}</dl>
  return <div className="space-y-8">
    <div><p className="text-sm font-semibold text-accent">{t('provisional')}</p><p className="text-sm text-muted mt-3 leading-relaxed">{t('limits')}</p></div>
    <section><h3 className="font-semibold text-lg mb-4">{t('overview')}</h3>{figures(data.summary, [['operatingIncome'], ['operatingExpenses'], ['operatingMargin'], ['nonOperatingIncome'], ['nonOperatingExpenses']])}<p className="text-sm text-muted mt-3">{t('records', { count: data.summary.entryCount })}</p></section>
    <section><h3 className="font-semibold text-lg mb-4">{t('cash')}</h3>{figures(data.cash, [['receipts'], ['payments'], ['balance', 'cashBalance']])}<p className="text-sm text-muted mt-3 leading-relaxed">{t('cashHint')}</p></section>
    <section><h3 className="font-semibold text-lg mb-4">{t('outstanding', { date: data.outstanding.asOf })}</h3>{figures(data.outstanding, [['receivable'], ['payable']])}</section>
    <section><h3 className="font-semibold text-lg mb-4">{t('milk')}</h3><dl className="grid grid-cols-2 gap-5 py-5 border-y border-line">{[['liters', 'produced'], ['soldLiters', 'sold']].map(([field, label]) => <div key={field} className="min-w-0"><dt className="text-sm text-muted">{t(label)}</dt><dd className="font-semibold mt-1"><bdi>{data.milk[field] == null ? t('missing') : `${data.milk[field]} ${t('liters')}`}</bdi></dd></div>)}</dl><p className="text-sm text-muted mt-3 leading-relaxed">{t('milkHint')}</p>{data.milk.excludedCount > 0 && <p className="text-sm text-accent mt-2">{t('excluded', { count: data.milk.excludedCount })}</p>}</section>
    <section><h3 className="font-semibold text-lg mb-4">{t('shared')}</h3>{figures(data.shared, [['operatingIncome'], ['operatingExpenses']])}<p className="text-sm text-muted mt-3 leading-relaxed">{t('sharedHint')}</p></section>
    <section><h3 className="font-semibold text-lg mb-3">{t('perAnimal')}</h3><p className="text-sm text-muted mb-4 leading-relaxed">{t('animalHint')}</p>
      {!data.animals.length ? <p className="text-muted">{t('noCattle')}</p> : <div className="max-w-full overflow-x-auto [scrollbar-width:thin] print:overflow-visible" role={print ? undefined : 'region'} tabIndex={print ? undefined : 0} aria-label={t('perAnimal')}><table className="w-full text-sm border-collapse [&_th]:text-start [&_th]:font-medium [&_th]:text-muted [&_:is(th,td)]:border-b [&_:is(th,td)]:border-line [&_:is(th,td)]:p-3 [&_:is(th,td)]:align-top [&_:is(th,td)]:min-w-32 print:[&_:is(th,td)]:min-w-0 print:[&_:is(th,td)]:p-1.5"><thead><tr>{['animal', 'operatingIncome', 'operatingExpenses', 'operatingMargin'].map(field => <th key={field}>{t(field)}</th>)}</tr></thead><tbody>{data.animals.map(item => <tr key={item.animalReference}><td className="wrap-anywhere">{!print && item.petId != null ? <Link className="text-accent underline" to={`/pets/${item.petId}`}>{item.name}</Link> : item.name}{item.petId == null && <span className="block text-xs text-muted">{t('deleted')}</span>}</td>{['operatingIncome', 'operatingExpenses', 'operatingMargin'].map(field => <td key={field}><bdi>{barnMoney(item[field], language)}</bdi></td>)}</tr>)}</tbody></table></div>}
    </section>
  </div>
}
export default function BarnReport({ barn, revision }) {
  const { language } = useLanguage(), t = key => barnText(language, key), today = barnToday()
  const [form, setForm] = useState({ from: today.slice(0, 8) + '01', to: today }), [applied, setApplied] = useState({ from: today.slice(0, 8) + '01', to: today })
  const [data, setData] = useState(null), [error, setError] = useState(''), [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(`/barns/${barn.id}/report?from=${applied.from}&to=${applied.to}`, { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) { setData(data); setError('') } }).catch(error => { if (!controller.signal.aborted) setError(barnError(error)) })
    return () => controller.abort()
  }, [barn.id, revision, applied.from, applied.to, retry])
  const ready = data?.barn.id === barn.id && data.period.from === applied.from && data.period.to === applied.to
  return <section className="min-w-0"><div className="flex justify-between items-center flex-wrap gap-3 mb-6"><h2 className="text-xl font-semibold">{t('report')}</h2><button className={barnButton} disabled={!ready || !!error} onClick={() => window.print()}>{t('pdf')}</button></div>
    <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end mb-8" onSubmit={event => { event.preventDefault(); setApplied({ ...form }); setRetry(value => value + 1) }}>
      {['from', 'to'].map(field => <label className="grid gap-2 text-sm min-w-0" key={field}>{t(field)}<input className={barnInput} type="date" required max={today} min={field === 'to' ? form.from : undefined} value={form[field]} onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))} /></label>)}<button className={barnPrimary}>{t('apply')}</button>
    </form>
    {error ? <p role="alert" className="text-rose-700 dark:text-rose-300">{t(error)}</p> : !ready ? <p role="status">{t('loading')}</p> : <Content data={data} language={language} />}
    {ready && !error && createPortal(<article id="barn-report-print" className="hidden print:block print:m-[0.25in] print:bg-white print:text-[#111827] print:text-[10pt] print:font-sans print:[&:lang(ur)]:font-urdu [--color-line:#d1d5db] [--color-muted:#4b5563] [--color-accent:#312e81] [--color-ink:#111827] print:[&_section]:break-inside-avoid print:[&_p]:text-inherit print:[&_h3]:text-[13pt] print:[&_dd]:text-[11pt]" lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}><header className="mb-6"><h1 className="text-2xl font-bold">{t('reportTitle')}</h1><p className="mt-2">{barn.name}</p><p><bdi>{data.period.from}</bdi> — <bdi>{data.period.to}</bdi></p></header><Content data={data} language={language} print /></article>, document.body)}
  </section>
}
