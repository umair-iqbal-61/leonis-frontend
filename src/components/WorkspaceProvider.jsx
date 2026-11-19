import { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetch } from '../lib/api'
import { WorkspaceContext } from '../lib/workspaceContext'
import { workspaceHome } from '../lib/workspace'
export default function WorkspaceProvider({ session, children }) {
  const token = session ? localStorage.getItem('token') : null
  const [result, setResult] = useState(null), [failure, setFailure] = useState(null), [revision, setRevision] = useState(0)
  const queue = useRef(Promise.resolve())
  const mutations = useRef(0)
  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    const generation = mutations.current
    apiFetch('/account/workspaces', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted && generation === mutations.current) { setResult({ token, data }); setFailure(null) }
    }).catch(() => { if (!controller.signal.aborted && generation === mutations.current) setFailure(token) })
    return () => controller.abort()
  }, [token, revision])
  const update = useCallback(body => {
    const operation = queue.current.catch(() => {}).then(async () => {
      if (!token || localStorage.getItem('token') !== token) throw new Error('Session changed')
      mutations.current++
      const { data } = await apiFetch('/account/workspaces', { method: 'PATCH', body: JSON.stringify(body) })
      if (localStorage.getItem('token') === token) { setResult({ token, data }); setFailure(null) }
      return data
    })
    queue.current = operation
    return operation
  }, [token])
  const data = token && result?.token === token ? result.data : null
  const status = !token ? 'anonymous' : failure === token ? 'error' : data ? 'ready' : 'loading'
  return <WorkspaceContext.Provider value={{ status, data, workspaces: data?.workspaces ?? [], activeWorkspace: data?.activeWorkspace ?? null,
    home: data ? workspaceHome(data.activeWorkspace) : '/dashboard', update,
    reload: () => { setFailure(null); setRevision(value => value + 1) },
  }}>{children}</WorkspaceContext.Provider>
}
