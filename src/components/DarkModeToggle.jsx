import { useDarkMode } from '../hooks/useDarkMode'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'

export default function DarkModeToggle() {
  const { dark, toggle } = useDarkMode()
  const { language } = useLanguage()

  return (
    <button type="button" onClick={toggle} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 rounded-control font-semibold leading-[1.4]
              cursor-pointer transition-[background-color,border-color,box-shadow,transform] duration-[160ms] ease-[ease]
              text-ink disabled:opacity-[0.55] disabled:cursor-wait p-0 text-[25px] w-11
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass"
      aria-label={recordText(language, dark ? 'lightTheme' : 'darkTheme')} aria-pressed={dark}>
      <span aria-hidden="true">{dark ? '☼' : '☾'}</span>
    </button>
  )
}
