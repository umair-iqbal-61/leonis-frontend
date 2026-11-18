import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './recordQualityPrint.css'
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
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.entries(report.counts).map(([key, value]) => (
          <div key={key} className="rounded-lg bg-gray-100 p-2 text-sm dark:bg-gray-800">
            <dt>{t(key)}</dt><dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {!report.findings.length && <p>{t('empty')}</p>}
      <ul className="space-y-3">
        {report.findings.map(item => (
          <li key={item.id} data-report-finding className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {[t(item.dimension), t(item.severity), t(item.status.toLowerCase()), !item.active && t('inactive')].filter(Boolean).join(' · ')}
            </p>
            <p className="wrap-anywhere">{t(item.explanationKey, item.parameters)}</p>
            <ul className="grid gap-2 text-xs sm:grid-cols-2">
              {item.records.map(record => (
                <li key={`${record.type}-${record.id}`} className="rounded bg-gray-100 p-2 dark:bg-gray-800">
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
                <button key={status} type="button" disabled={busy} onClick={() => update(item.id, status)} className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-50 dark:border-gray-600">{t(label)}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <section className="space-y-4 text-gray-900 dark:text-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{t('quality')}</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <button type="button" disabled={busy || loading} onClick={() => update()} className="rounded-lg bg-violet-600 px-3 py-2 text-white disabled:opacity-50">{t('check')}</button>
          {report && <button type="button" disabled={busy} onClick={() => window.print()} className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600">{t('download')}</button>}
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{t('error')}</p>}
      {!report && !error && <p role="status">{t('load')}</p>}
      {content}
      {report && createPortal(
        <article id="record-quality-print" lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}>
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
