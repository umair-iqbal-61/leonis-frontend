import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'

export default function Landing() {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  return (
    <PublicLayout>
      <section className="relative flex items-center min-h-[min(760px,_calc(100svh_-_77px))] overflow-hidden bg-[#2f322c]
              [&_h1]:max-w-140 [&_h1]:text-[clamp(30px,_4vw,_48px)] [&_h1]:font-medium [&_h1]:leading-[1.15]
              [&_h1]:tracking-[-1.5px] [&_h1+p]:max-w-122.5 [&_h1+p]:mt-5 [&_h1+p]:text-[#f4f0fa] [&_h1+p]:text-[17px]
              [&_h1+p]:leading-[1.7] max-md:min-h-[calc(100svh_-_69px)] max-md:[&_h1]:text-[32px] max-md:[&_h1]:max-w-80
              max-md:[&_h1+p]:text-[15px] max-md:[&_h1+p]:max-w-90 [&:lang(ur)_h1]:max-w-[600px]
              [&:lang(ur)_h1]:leading-[1.6]">
        <img className="absolute inset-0 w-full h-full object-cover object-center max-md:[object-position:65%_center]" src="/leonis-cat.jpg" alt={t('homePhoto')} fetchPriority="high" />
        <div className="absolute inset-0 w-full h-full [background:linear-gradient(90deg,_#111019d9,_#11101952_65%,_#11101918)]
              rtl:[background:linear-gradient(270deg,_#111019d9,_#11101952_65%,_#11101918)]
              max-md:[background:linear-gradient(0deg,_#111019ed,_#11101955)]
              max-md:rtl:[background:linear-gradient(0deg,_#111019ed,_#11101955)]" />
        <div className="animate-workspace-enter motion-reduce:animate-none relative w-full max-w-300 mx-auto py-16 px-6 text-white max-md:py-10 max-md:px-5">
          <p className="w-fit font-sans text-[clamp(50px,_7vw,_90px)] font-[650] tracking-[-4px] leading-[1] mb-8 max-md:text-[60px] max-md:mb-7" dir="ltr">leonis.</p>
          <h1>{t('homeTitle')}</h1>
          <p>{t('homeDescription')}</p>
          <div className="flex flex-wrap gap-3 mt-7 [&>a:last-child]:text-white [&>a:last-child]:bg-[#ffffff14] [&>a:last-child]:border-[#ffffff66] [&>a:last-child:hover]:bg-[#ffffff30]">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t('getStarted')}</Link>
            <a href="#how" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t('seeWorkflow')}</a>
          </div>
        </div>
      </section>
      <div className="max-w-300 mx-auto px-6 max-md:px-5">
        <p className="pt-3 text-muted text-[11px] text-end [&_a]:underline"><a href="https://unsplash.com/photos/sleeping-orange-and-white-cat-by-window-YMEC22V5uLE">{t('homePhotoCredit')}</a></p>
        <section className="grid grid-cols-3 gap-12 py-20 [&_h2]:text-[28px] [&_h2]:font-[550] [&_h2]:tracking-[-0.8px]
              [&_h2]:leading-[1.3] [&_p]:mt-4 [&_p]:text-muted [&_p]:text-[15px] [&_p]:leading-[1.8] max-md:grid-cols-1
              max-md:gap-8 max-md:py-12" aria-label={t('records')}>
          {['homeRecords', 'homeQuality', 'homeAssistant'].map(key => (
            <article key={key}><h2>{t(key)}</h2><p>{t(key + 'Text')}</p></article>
          ))}
        </section>
        <section id="how" className="[&_h2]:text-[28px] [&_h2]:font-[550] [&_h2]:tracking-[-0.8px] [&_h2]:leading-[1.3] [&_p]:mt-4 [&_p]:text-muted
              [&_p]:text-[15px] [&_p]:leading-[1.8] py-16 border-y border-line [&_ol]:grid [&_ol]:grid-cols-3 [&_ol]:gap-12
              [&_ol]:mt-10 [&_h3]:text-[18px] [&_h3]:font-semibold max-md:[&_ol]:grid-cols-1 max-md:[&_ol]:gap-8 max-md:py-12">
          <h2>{t('homeStepsTitle')}</h2>
          <ol>
            {['homeStep1', 'homeStep2', 'homeStep3'].map(key => (
              <li key={key}><h3>{t(key)}</h3><p>{t(key + 'Text')}</p></li>
            ))}
          </ol>
        </section>
        <section className="[&_h2]:text-[28px] [&_h2]:font-[550] [&_h2]:tracking-[-0.8px] [&_h2]:leading-[1.3] flex items-center
              justify-between gap-8 py-20 max-md:items-start max-md:flex-col max-md:py-12">
          <h2>{t('homeFinal')}</h2>
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t('createAccount')}</Link>
        </section>
        <footer className="flex justify-between flex-wrap gap-4 py-6 border-t border-line text-muted text-[13px]"><span dir="ltr">leonis.</span><p>{t('homeFooter')}</p></footer>
      </div>
    </PublicLayout>
  )
}
