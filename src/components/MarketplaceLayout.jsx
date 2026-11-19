import { NavLink } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import PublicLayout from './PublicLayout'
import { useLanguage } from '../hooks/useLanguage'
import { marketText } from '../lib/marketplace'

export default function MarketplaceLayout({ session, setSession, children }) {
  const { language } = useLanguage()
  const t = key => marketText(language, key)
  const content = <div className="min-w-0 max-w-300 mx-auto">
    <nav aria-label={t('marketplace')} className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line mb-8 text-sm">
      {[['/marketplace', 'marketplace'], [session ? '/marketplace/mine' : '/login', 'myListings']].map(([path, label]) => (
        <NavLink key={label} to={path} end className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? 'border-accent text-accent font-semibold' : 'border-transparent text-muted'}`}>{t(label)}</NavLink>
      ))}
    </nav>
    {children}
  </div>
  return session ? <Dashboard setSession={setSession}>{content}</Dashboard>
    : <PublicLayout><div className="max-w-300 mx-auto px-4 py-8 md:px-6 md:py-12">{content}</div></PublicLayout>
}
