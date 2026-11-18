import { Link } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'

export default function AppHeader({ home = '/', children }) {
  const { language, setLanguage } = useLanguage()
  const t = key => recordText(language, key)
  return (
    <header className="sticky top-0 z-20 border-b border-line glass-header">
      <nav className="flex items-center justify-between gap-3 max-w-300 mx-auto py-4 px-6 max-md:py-3 max-md:px-4 max-md:gap-2 max-[360px]:px-3" aria-label={t('mainNavigation')}>
        <Link to={home} className="inline-flex items-center gap-2.5 min-h-11 text-ink font-sans text-[29px] font-bold tracking-[-1.5px]
              max-md:text-[25px] max-md:gap-[7px] [&:lang(ur)]:tracking-normal" dir="ltr" aria-label={t(home === '/dashboard' ? 'animalsHome' : 'brandHome')}>
          <span className="grid place-items-center w-9 h-9 rounded-xl text-[#fff] bg-action text-[27px] leading-[1] max-md:w-7.5
              max-md:h-7.5 max-md:rounded-[10px] max-md:text-[24px] max-[360px]:hidden" aria-hidden="true">✳</span>
          <span>leonis<span className="text-accent">.</span></span>
        </Link>
        <div className="flex items-center gap-2 max-md:gap-1.5">
          <label className="sr-only" htmlFor="workspace-language">{t('language')}</label>
          <select id="workspace-language" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              max-w-27.5 ps-3 pe-6 hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] max-md:max-w-20 max-md:w-20 max-md:ps-2
              max-md:pe-4.5 max-md:text-[16px] glass" value={language}
            onChange={event => setLanguage(event.target.value)}>
            <option value="en" lang="en" aria-label="English">EN</option>
            <option value="ur" lang="ur">اردو</option>
          </select>
          <DarkModeToggle />
          {children}
        </div>
      </nav>
    </header>
  )
}
