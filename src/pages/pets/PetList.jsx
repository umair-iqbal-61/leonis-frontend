import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import PetCard from '../../components/PetCard'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'

export default function PetList() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { language } = useLanguage()
  const t = (key, parameters) => recordText(language, key, parameters)

  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/pets', { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setPets(data) })
      .catch(error => { if (!controller.signal.aborted) setError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  return (
    <div className="animate-workspace-enter motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-5 mb-8 [&_h1]:text-[clamp(28px,_4vw,_40px)] [&_h1]:leading-[1.2]
              [&_h1]:font-[650] [&_h1]:tracking-[-1.4px] max-md:items-end max-md:gap-3 max-md:mb-6 max-md:[&_h1]:text-[30px]
              max-md:[&_.primary-control]:px-3 max-md:[&_.primary-control]:whitespace-nowrap max-[360px]:items-start
              max-[360px]:flex-col">
        <div>
          <h1>{t('yourAnimals')}</h1>
          {!loading && !error && pets.length > 0 && <p className="text-muted text-[14px] mt-2.5">{t(pets.length === 1 ? 'animalCountSingle' : 'animalCount', { value: pets.length })}</p>}
        </div>
        <Link to="/pets/add" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none"><span aria-hidden="true">+</span> {t('addAnimal')}</Link>
      </div>
      {loading && <p role="status" className="text-muted py-12 text-center">{t('load')}</p>}
      {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      {!loading && !error && (pets.length === 0 ? (
        <div className="py-16 px-5 text-center border-t border-line [&_h2]:text-[24px] [&_h2]:font-semibold [&_p]:text-muted [&_p]:mt-3 [&_p]:mx-0 [&_p]:mb-6">
          <h2>{t('noAnimals')}</h2>
          <p>{t('firstAnimal')}</p>
          <Link to="/pets/add" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t('addAnimal')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1 max-md:gap-4">
          {pets.map(pet => <PetCard key={pet.id} pet={pet} language={language} />)}
        </div>
      ))}
    </div>
  )
}
