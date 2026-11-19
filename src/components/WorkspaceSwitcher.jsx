import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../hooks/useWorkspace'
import { useLanguage } from '../hooks/useLanguage'
import { workspaceText, workspaceHome } from '../lib/workspace'
export default function WorkspaceSwitcher() {
  const workspace = useWorkspace(), { language } = useLanguage(), navigate = useNavigate()
  const t = key => workspaceText(language, key)
  const [busy, setBusy] = useState(false), [error, setError] = useState(false)
  if (workspace.status !== 'ready') return <Link className="min-h-11 inline-flex items-center text-muted" to="/workspaces">{t('workspaces')}</Link>
  return <div className="min-w-0 flex items-center gap-2">
    <label className="sr-only" htmlFor="account-workspace">{t('workspace')}</label>
    <select id="account-workspace" className="min-h-11 max-w-32 rounded-lg bg-transparent text-ink text-sm pe-5 ps-1 dark:[color-scheme:dark]" value={workspace.activeWorkspace} disabled={busy} onChange={async event => {
      const value = event.target.value
      if (value === 'manage') { navigate('/workspaces'); return }
      setBusy(true); setError(false)
      try { const data = await workspace.update({ activeWorkspace: value }); navigate(workspaceHome(data.activeWorkspace)) }
      catch { setError(true) } finally { setBusy(false) }
    }}>{workspace.workspaces.map(value => <option key={value} value={value}>{t(value)}</option>)}<option value="manage">{t('workspaces')}</option></select>
    {error && <span role="alert" className="max-w-40 text-xs text-rose-700 dark:text-rose-300">{t('failed')}</span>}
  </div>
}
