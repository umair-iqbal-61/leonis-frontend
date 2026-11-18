import { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { apiFetch } from '../../lib/api'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-ink shadow-sm">
      <p className="mb-1 text-xs text-muted">{label}</p>
      <p className="text-sm font-semibold text-accent">{payload[0].value} {unit}</p>
    </div>
  )
}

export default function WeightChart({ petId }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(30)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const from = new Date()
    if (range !== null) from.setDate(from.getDate() - range)

    apiFetch('/pets/' + petId + '/weights', { signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted) return
        const records = [...(data || [])]
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .filter(item => range === null || new Date(item.createdAt) >= from)
        setData(records.map(item => ({
          weight: Number(item.weight),
          date: new Date(item.createdAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-GB', { month: 'short', day: 'numeric' }),
        })))
      })
      .catch(error => {
        if (!controller.signal.aborted) setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [petId, range, language])

  const ranges = [
    { label: 'range14', days: 14 },
    { label: 'range30', days: 30 },
    { label: 'range90', days: 90 },
    { label: 'rangeAll', days: null },
  ]
  const trend = data.length >= 2 ? data.at(-1).weight - data[0].weight : null

  return (
    <section className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-semibold text-ink max-md:text-base">{t('weightHistory')}</h3>
          {trend !== null && <p className="mt-1 text-xs text-muted">
            <bdi>{trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(1)} {t('overPeriod')}</bdi>
          </p>}
        </div>
        <div className="flex max-w-full flex-wrap gap-1 rounded-control border border-line bg-canvas p-1" role="group" aria-label={t('chartRange')}>
          {ranges.map(item => (
            <button type="button" key={item.label} aria-pressed={range === item.days}
              className="min-h-11 min-w-11 cursor-pointer rounded-[10px] px-3 text-xs font-medium text-muted
                transition-colors hover:text-ink aria-pressed:bg-surface aria-pressed:text-accent aria-pressed:shadow-sm"
              onClick={() => {
                if (range === item.days) return
                setLoading(true)
                setError('')
                setRange(item.days)
              }}>{t(item.label)}</button>
          ))}
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg border-s-[3px] border-rose-700 bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
      {loading ? <p role="status" className="grid h-56 place-items-center text-sm text-muted">{t('load')}</p>
        : data.length < 2 ? <p className="grid h-56 place-items-center rounded-xl border border-dashed border-line bg-canvas p-6 text-center text-sm text-muted">{t('chartHint')}</p>
        : (
          <div className="h-56 min-w-0 text-muted" dir="ltr" role="group" aria-label={t('weightHistory')}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} stroke="currentColor" />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} stroke="currentColor"
                  domain={['dataMin - 0.5', 'dataMax + 0.5']} tickFormatter={value => value + ' ' + t('kg')} />
                <Tooltip content={<CustomTooltip unit={t('kg')} />} />
                <Line type="monotone" dataKey="weight" stroke="var(--color-accent)" strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: 'var(--color-accent)', strokeWidth: 0 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      {!loading && data.length >= 2 && (
        <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
          {[
            { label: 'lowest', value: Math.min(...data.map(item => item.weight)) },
            { label: 'average', value: (data.reduce((sum, item) => sum + item.weight, 0) / data.length).toFixed(1) },
            { label: 'highest', value: Math.max(...data.map(item => item.weight)) },
          ].map(item => (
            <div key={item.label} className="min-w-0">
              <dt className="text-xs text-muted">{t(item.label)}</dt>
              <dd className="mt-2 wrap-anywhere text-sm font-semibold text-ink"><bdi>{item.value} {t('kg')}</bdi></dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
