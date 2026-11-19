import { useState } from 'react'
import { useWorkspace } from '../hooks/useWorkspace'
import { useLanguage } from '../hooks/useLanguage'
import { workspaceText } from '../lib/workspace'
import { marketButton, marketInput, marketPrimary } from '../lib/marketplace'
function Form({ workspace }) {
  const { language } = useLanguage(), t = key => workspaceText(language, key)
  const [enabled, setEnabled] = useState(workspace.workspaces), [active, setActive] = useState(workspace.activeWorkspace), [busy, setBusy] = useState(false), [error, setError] = useState(false), [saved, setSaved] = useState(false)
  return <form className="max-w-180 grid gap-6" onSubmit={async event => {
    event.preventDefault(); if (busy) return; setBusy(true); setError(false); setSaved(false)
    try { await workspace.update({ workspaces: enabled, activeWorkspace: active }); setSaved(true) }
    catch { setError(true) } finally { setBusy(false) }
  }}><h1 className="text-3xl font-semibold">{t('workspaces')}</h1><p className="text-muted leading-relaxed">{t('enableHint')}</p>
    <fieldset className="divide-y divide-line" disabled={busy}><legend className="sr-only">{t('choose')}</legend>{['PETS', 'LIVESTOCK'].map(value => <label key={value} className="flex items-start gap-4 py-5"><input className="h-5 w-5 mt-1 shrink-0 accent-violet-700" type="checkbox" checked={enabled.includes(value)} onChange={event => {
      const values = event.target.checked ? [...enabled, value] : enabled.filter(item => item !== value)
      setEnabled(values); if (!values.includes(active)) setActive(values[0] ?? ''); setSaved(false)
    }} /><span><span className="block font-semibold">{t(value)}</span><span className="block text-sm text-muted mt-2">{t(value === 'PETS' ? 'petsHint' : 'livestockHint')}</span></span></label>)}</fieldset>
    <label className="grid gap-2 text-sm">{t('active')}<select className={`${marketInput} dark:[color-scheme:dark]`} value={active} disabled={busy || !enabled.length} onChange={event => { setActive(event.target.value); setSaved(false) }}>{enabled.map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label>
    {!enabled.length && <p role="alert">{t('none')}</p>}{error && <p role="alert" className="text-rose-700 dark:text-rose-300">{t('failed')}</p>}{saved && <p role="status" className="text-accent">{t('saved')}</p>}
    <div><button className={marketPrimary} disabled={busy || !enabled.length}>{t(busy ? 'saving' : 'save')}</button></div>
  </form>
}
export default function Workspaces() {
  const workspace = useWorkspace(), { language } = useLanguage(), t = key => workspaceText(language, key)
  if (workspace.status === 'error') return <div role="alert"><p>{t('failed')}</p><button className={`${marketButton} mt-4`} onClick={workspace.reload}>{t('retry')}</button></div>
  if (workspace.status !== 'ready') return <p role="status">{t('loading')}</p>
  return <Form workspace={workspace} />
}
