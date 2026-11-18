import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { apiFetch } from '../../lib/api'
import { recordText } from '../../lib/recordLanguage'

const decisions = { OPEN: 'reopen', REVIEWED: 'review', DISMISSED: 'dismiss', RESOLVED: 'resolve' }

export default function RecordQuality({ petId, petName, language }) {
  const [report, setReport] = useState(null)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const url = `/pets/${petId}/quality`
  const t = (key, parameters) => recordText(language, key, parameters)

  useEffect(() => {
    const controller = new AbortController()
    apiFetch(url, { signal: controller.signal })
      .then(({ data }) => setReport(data))
      .catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [url])

  async function update(findingId, status) {
    setError(false)
    setBusy(true)
    try {
      if (findingId) {
        await apiFetch(`${url}/findings/${findingId}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      }
      const { data } = await apiFetch(findingId ? url : `${url}/check`, { method: findingId ? 'GET' : 'POST' })
      setReport(data)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  const content = report && (
    <>
      <dl className="grid grid-cols-3 gap-4 py-4 border-y border-line [&_dt]:text-[12px] [&_dt]:text-muted [&_dd]:mt-1 [&_dd]:text-[20px] [&_dd]:font-semibold">
        {Object.entries(report.counts).map(([key, value]) => (
          <div key={key} className="quality-count">
            <dt>{t(key)}</dt><dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {!report.findings.length && <p>{t('empty')}</p>}
      <ul className="space-y-3">
        {report.findings.map(item => (
          <li key={item.id} data-report-finding className="py-5 border-b border-line wrap-anywhere space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {[t(item.dimension), t(item.severity), t(item.status.toLowerCase()), !item.active && t('inactive')].filter(Boolean).join(' · ')}
            </p>
            <p className="wrap-anywhere">{t(item.explanationKey, item.parameters)}</p>
            {item.source && (
              <p className="text-xs">
                <a className="text-violet-700 underline dark:text-violet-300" href={item.source.url}>{item.source.title}</a>
              </p>
            )}
            <ul className="grid grid-cols-2 gap-3 [&>li]:min-w-0 [&>li]:p-3 [&>li]:bg-canvas [&>li]:rounded-xl [&>li]:text-[13px] max-md:grid-cols-1">
              {item.records.map(record => (
                <li key={`${record.type}-${record.id}`} className="quality-record">
                  <p className="font-medium">{t(record.type)} <bdi>#{record.id}</bdi></p>
                  {record.values ? (
                    <dl className="space-y-1">
                      {record.fields.map(field => (
                        <div key={field} className="flex flex-wrap gap-1">
                          <dt>{t(field)}</dt><dd className="wrap-anywhere"><bdi>{t(record.values[field] ?? 'missing')}</bdi></dd>
                        </div>
                      ))}
                    </dl>
                  ) : <p>{t('recordRemoved')}</p>}
                </li>
              ))}
            </ul>
            <div data-report-actions className="flex flex-wrap gap-2">
              {Object.entries(decisions).filter(([status]) => status !== item.status && (status !== 'RESOLVED' || !item.active)).map(([status, label]) => (
                <button key={status} type="button" disabled={busy} onClick={() => update(item.id, status)} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t(label)}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <section className="[&_h3]:text-ink [&_h3]:text-[17px] [&_h3]:font-semibold space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{t('quality')}</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <button type="button" disabled={busy || loading} onClick={() => update()} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t('check')}</button>
          {report && <button type="button" disabled={busy} onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t('download')}</button>}
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{t('error')}</p>}
      {!report && !error && <p role="status">{t('load')}</p>}
      {content}
      {report && createPortal(
        <article id="record-quality-print"
          className="hidden print:block print:m-[0.25in] print:text-[#111827] print:bg-white print:text-[11pt]
            print:font-sans print:[&:lang(ur)]:font-urdu wrap-anywhere [color-scheme:light]
            [--color-canvas:#f7f6f3] [--color-ink:#111827] [--color-muted:#4b5563] [--color-line:#d1d5db]
            print:[&_header]:mb-4 print:[&_header]:break-after-avoid print:[&_h1]:text-[20pt] print:[&_h1]:font-bold
            print:[&_:is(dl,[data-report-finding])]:break-inside-avoid print:[&_a]:text-[#312e81]!
            print:[&_:is(p,dl,li,div)]:text-inherit! print:[&_:is(p,dl,li,div)]:bg-transparent!
            print:[&_:is(p,dl,li,div)]:border-gray-300! print:[&_[data-report-actions]]:hidden"
          lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}>
          <header>
            <h1>{t('reportTitle')}</h1>
            <p><bdi>{petName}</bdi> · <bdi>#{petId}</bdi></p>
          </header>
          {content}
        </article>,
        document.body,
      )}
    </section>
  )
}
