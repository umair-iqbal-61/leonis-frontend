import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import PublicLayout from './PublicLayout'
import { apiFetch } from '../lib/api'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import { storeText } from '../lib/store'
export default function StoreLayout({ session, setSession, children }) {
  const { language } = useLanguage(), { items } = useCart()
  const t = key => storeText(language, key)
  const [access, setAccess] = useState(false)
  useEffect(() => {
    if (!session) return
    const controller = new AbortController()
    apiFetch('/store/access', { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) setAccess(data.isAdmin) }).catch(() => { if (!controller.signal.aborted) setAccess(false) })
    return () => controller.abort()
  }, [session])
  const content = <div className="max-w-300 mx-auto min-w-0">
    <nav className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line mb-8 text-sm" aria-label={t('store')}>
      {[['/store', 'store'], ['/store/cart', 'cart'], [session ? '/store/orders' : '/login', 'orders'], ...(session && access ? [['/store/admin', 'admin']] : [])].map(([path, label]) =>
        <NavLink key={label} to={path} end className={({ isActive }) => `inline-flex min-h-11 items-center gap-2 border-b-2 ${isActive ? 'border-accent text-accent font-semibold' : 'border-transparent text-muted'}`}>{t(label)}{label === 'cart' && items.length > 0 && <bdi>({items.reduce((sum, item) => sum + item.quantity, 0)})</bdi>}</NavLink>)}
    </nav>{children}
  </div>
  return session ? <Dashboard setSession={setSession}>{content}</Dashboard> : <PublicLayout><div className="px-4 py-8 md:px-6 md:py-12">{content}</div></PublicLayout>
}
