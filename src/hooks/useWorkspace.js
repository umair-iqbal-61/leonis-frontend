import { useContext } from 'react'
import { WorkspaceContext } from '../lib/workspaceContext'
export function useWorkspace() {
  const workspace = useContext(WorkspaceContext)
  if (!workspace) throw new Error('WorkspaceProvider is required')
  return workspace
}
