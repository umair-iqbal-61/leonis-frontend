import AppHeader from '../components/AppHeader'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'
import { useWorkspace } from '../hooks/useWorkspace'

export default function Dashboard({ setSession, children }) {
  const { language } = useLanguage()
  const { home } = useWorkspace()
  const t = key => recordText(language, key)

  return (
    <div className="min-h-svh text-ink bg-canvas font-sans [&:lang(ur)]:font-urdu [&:lang(ur)]:leading-[1.8]
              [&_:is(button,a,select,input,textarea):focus-visible]:[outline:3px_solid_var(--color-accent)]
              [&_:is(button,a,select,input,textarea):focus-visible]:[outline-offset:4px] [&_button:disabled]:cursor-wait
              [&:lang(ur)]:[&_:is(h1,h2)]:tracking-normal motion-reduce:[&_*]:[transition-duration:0.01ms]!
              motion-reduce:[&_*]:[animation-duration:0.01ms]! motion-reduce:[&_*]:[scroll-behavior:auto]!
              motion-reduce:[&_*::before]:[transition-duration:0.01ms]!
              motion-reduce:[&_*::before]:[animation-duration:0.01ms]! motion-reduce:[&_*::before]:[scroll-behavior:auto]!
              motion-reduce:[&_*::after]:[transition-duration:0.01ms]!
              motion-reduce:[&_*::after]:[animation-duration:0.01ms]! motion-reduce:[&_*::after]:[scroll-behavior:auto]!
              [&_input::placeholder]:text-muted [&_textarea::placeholder]:text-muted" lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <a className="fixed -top-25 start-4 z-30 bg-surface p-3 rounded-lg focus:top-2" href="#workspace-content">{t('skipContent')}</a>
      <AppHeader home={home}>
        <button type="button" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] max-md:px-2.5 max-md:text-[12px] glass" onClick={() => {
          localStorage.removeItem('token')
          setSession(false)
        }}>{t('logout')}</button>
      </AppHeader>
      <main id="workspace-content" className="max-w-300 mx-auto pt-12 px-6 pb-20 max-md:pt-7 max-md:px-4 max-md:pb-12 max-[360px]:px-3" tabIndex={-1}>{children}</main>
    </div>
  )
}
