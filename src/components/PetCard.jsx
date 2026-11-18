import { Link } from 'react-router-dom'
import { recordText } from '../lib/recordLanguage'

const speciesEmoji = { dog: '🐶', cat: '🐱', bird: '🐦', fish: '🐟', rabbit: '🐰', 'dairy-cattle': '🐄', other: '🐾' }

export default function PetCard({ pet, language }) {
  const t = (key, parameters) => recordText(language, key, parameters)
  const avatar = pet.avatarUrl || pet.avatar_url

  return (
    <Link to={`/pets/${pet.id}`} className="block overflow-hidden rounded-panel bg-surface border border-line transition-[transform,box-shadow]
              duration-[180ms] ease-[ease] [&_h2]:text-[23px] [&_h2]:font-semibold [&_h2]:tracking-[-0.6px]
              [&_h2]:wrap-anywhere hover:-translate-y-[3px] hover:shadow-[0_12px_26px_#2723350a] hover:[&_img]:scale-[1.025]
              max-md:grid max-md:grid-cols-[100px_minmax(0,_1fr)] max-md:rounded-card max-md:[&_h2]:text-[22px]
              max-[360px]:grid-cols-[80px_minmax(0,_1fr)]">
      <div className="h-45 grid place-items-center bg-portrait overflow-hidden dark:bg-portrait-dark [&>span]:text-[64px]
              [&>span]:leading-[1] [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:transition-[transform]
              [&_img]:duration-[250ms] [&_img]:ease-[ease] max-md:h-full max-md:min-h-45 max-md:[&>span]:text-[46px]">
        {avatar
          ? <img src={avatar} alt="" loading="lazy" />
          : <span aria-hidden="true">{speciesEmoji[pet.species] || '🐾'}</span>}
      </div>
      <div className="p-5.5 max-md:p-4.5">
        <div className="flex items-center justify-between gap-3">
          <h2>{pet.name}</h2>
          <span className="text-accent text-[22px]" aria-hidden="true">{language === 'ur' ? '↖' : '↗'}</span>
        </div>
        <p className="text-[14px] text-muted mt-1 wrap-anywhere max-md:text-[13px]">{t(pet.species)}{pet.breed ? ` · ${pet.breed}` : ''}</p>
        <dl className="flex flex-wrap gap-y-3.5 gap-x-5.5 mt-6 [&_dt]:text-[12px] [&_dt]:text-muted [&_dd]:mt-1 [&_dd]:text-[14px]
              max-md:gap-y-2 max-md:gap-x-4 max-md:mt-4 max-md:[&_dd]:text-[13px]">
          {pet.age != null && <div><dt>{t('age')}</dt><dd>{t('yearsOld', { value: pet.age })}</dd></div>}
          {pet.gender && <div><dt>{t('gender')}</dt><dd>{t(pet.gender)}</dd></div>}
          {pet.weight != null && <div><dt>{t('weight')}</dt><dd><bdi>{pet.weight} {t('kg')}</bdi></dd></div>}
        </dl>
        <p className="flex items-center justify-between mt-6 pt-4 border-t border-line text-accent text-[13px] font-semibold max-md:mt-4 max-md:pt-3">{t('viewRecords')} <span aria-hidden="true">{language === 'ur' ? '←' : '→'}</span></p>
      </div>
    </Link>
  )
}
