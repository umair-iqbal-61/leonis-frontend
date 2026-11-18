import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { recordText } from '../../lib/recordLanguage'

export default function SpeciesGuide({ pet, language }) {
  const [entries, setEntries] = useState(null)
  const [error, setError] = useState(false)
  const url = `/pets/${pet.id}/guide`

  useEffect(() => {
    const controller = new AbortController()
    apiFetch(url, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setEntries(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [url])

  const t = key => recordText(language, key)
  return (
    <section className="space-y-4 text-gray-900 dark:text-gray-100">
      <h3 className="font-semibold">{t('guide')}</h3>
      <p className="text-sm">{t('guideScope')}</p>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{t('error')}</p>}
      {!entries && !error && <p role="status">{t('load')}</p>}
      {entries?.length === 0 && <p className="text-sm">{t('noGuide')}</p>}
      {entries?.map(entry => (
        <article key={entry.id} className="space-y-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
          <h4 className="font-medium">{entry.title[language] ?? entry.title.en}</h4>
          <p className="text-sm">{entry.text[language] ?? entry.text.en}</p>
          <a className="text-sm text-violet-700 underline dark:text-violet-300" href={entry.source.url}>{entry.source.title}</a>
        </article>
      ))}
    </section>
  )
}
