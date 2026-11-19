import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useWorkspace } from '../hooks/useWorkspace'
import { useLanguage } from '../hooks/useLanguage'
import { workspaceText } from '../lib/workspace'
import { marketButton, marketPrimary } from '../lib/marketplace'
export default function WorkspaceGate({ required, home = false, children }) {
  const workspace = useWorkspace(), { language } = useLanguage()
  const t = (key, params) => workspaceText(language, key, params)
  const [busy, setBusy] = useState(false), [error, setError] = useState(false)
  if (workspace.status === 'error') return <div role="alert"><p>{t('failed')}</p><button className={`${marketButton} mt-4`} onClick={workspace.reload}>{t('retry')}</button></div>
  if (workspace.status !== 'ready') return <p role="status">{t('loading')}</p>
  if (home) return <Navigate to={workspace.home} replace />
  if (!required || workspace.activeWorkspace === required) return children
  const enabled = workspace.workspaces.includes(required)
  return <section className="max-w-170 py-7"><h1 className="text-2xl font-semibold">{t('notActive', { workspace: t(required) })}</h1><p className="text-muted mt-3">{t(required === 'PETS' ? 'petsHint' : 'livestockHint')}</p>
    {error && <p role="alert" className="text-rose-700 dark:text-rose-300 mt-4">{t('failed')}</p>}
    <button className={`${marketPrimary} mt-6`} disabled={busy} onClick={async () => {
      setBusy(true); setError(false)
      try { await workspace.update({ workspaces: enabled ? workspace.workspaces : [...workspace.workspaces, required], activeWorkspace: required }) }
      catch { setError(true) } finally { setBusy(false) }
    }}>{t(enabled ? 'open' : 'enable', { workspace: t(required) })}</button>
  </section>
}
