import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { useLanguage } from '../hooks/useLanguage'
import { storeText } from '../lib/store'
export default function StoreAdminLayout({ children }) {
  const { language } = useLanguage(), t = key => storeText(language, key)
  const [access, setAccess] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/store/access', { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) setAccess(data.isAdmin) })
      .catch(() => { if (!controller.signal.aborted) setAccess(false) })
    return () => controller.abort()
  }, [])
  if (access === null) return <p role="status">{t('loading')}</p>
  if (!access) return <p role="alert">{t('adminOnly')}</p>
  return <div><nav className="flex flex-wrap gap-x-6 gap-y-1 mb-8 text-sm" aria-label={t('admin')}>
    {[['/store/admin', 'products'], ['/store/admin/settings', 'settings'], ['/store/admin/orders', 'allOrders']].map(([path, label]) => <NavLink key={path} to={path} end className={({ isActive }) => `inline-flex min-h-11 items-center ${isActive ? 'text-accent font-semibold underline underline-offset-8' : 'text-muted'}`}>{t(label)}</NavLink>)}
  </nav>{children}</div>
}
