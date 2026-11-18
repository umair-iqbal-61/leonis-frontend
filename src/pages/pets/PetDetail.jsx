import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { recordText } from '../../lib/recordLanguage'
import { useLanguage } from '../../hooks/useLanguage'
import SpeciesGuide from '../../components/tracking/SpeciesGuide'
import DairyRecords from '../../components/tracking/DairyRecords'
import RecordQuality from '../../components/tracking/RecordQuality'
import MealLog from '../../components/tracking/MealLog'
import WeightLog from '../../components/tracking/WeightLog'
import VetVisits from '../../components/tracking/VetVisits'
import Reminders from '../../components/tracking/Reminders'
import PhotoGallery from '../../components/tracking/PhotoGallery'

const Chat = lazy(() => import('../../components/Chat'))
const WeightChart = lazy(() => import('../../components/tracking/WeightChart'))

const speciesEmoji = { dog: '🐶', cat: '🐱', bird: '🐦', fish: '🐟', rabbit: '🐰', 'dairy-cattle': '🐄', other: '🐾' }
const tabs = ['Overview', 'quality', 'Meals', 'Weight', 'Chart', 'Vet Visits', 'Reminders', 'Photos', 'AI Chat', 'guide']

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = (key, parameters) => recordText(language, key, parameters)
  const [pet, setPet] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const avatarRef = useRef()

  useEffect(() => {
    const controller = new AbortController()
    apiFetch(`/pets/${id}`, { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setPet(data) })
      .catch(error => { if (!controller.signal.aborted) setError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id])

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const body = new FormData()
    body.append('photo', file)
    setUploading(true)
    setError('')
    try {
      const { data } = await apiFetch(`/pets/${id}/avatar`, { method: 'POST', body })
      setPet(current => ({ ...current, avatarUrl: data.avatarUrl }))
    } catch (error) {
      setError(error.message)
    } finally {
      setUploading(false)
      if (avatarRef.current) avatarRef.current.value = ''
    }
  }

  async function handleDelete() {
    if (!window.confirm(t('confirmDeleteAnimal', { name: pet.name }))) return
    try {
      await apiFetch(`/pets/${id}`, { method: 'DELETE' })
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) return <p role="status" className="text-muted py-12 text-center">{t('load')}</p>
  if (!pet) return <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error || t('error')}</p>

  const visibleTabs = pet.species === 'dairy-cattle' ? [...tabs, 'dairy'] : tabs
  const recordTab = ['quality', 'guide', 'dairy'].includes(activeTab)
  const details = [
    { label: 'age', value: pet.age != null ? t('yearsOld', { value: pet.age }) : t('missing') },
    { label: 'weight', value: pet.weight != null ? `${pet.weight} ${t('kg')}` : t('missing') },
    { label: 'gender', value: pet.gender ? t(pet.gender) : t('missing') },
  ]

  return (
    <div className="animate-workspace-enter motion-reduce:animate-none">
      <Link to="/dashboard" className="inline-flex items-center gap-2.5 min-h-11 mb-6 text-muted text-[14px] max-md:mb-4"><span aria-hidden="true">{language === 'ur' ? '→' : '←'}</span> {t('allAnimals')}</Link>
      {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      <div className="grid grid-cols-[280px_minmax(0,_1fr)] gap-10 items-start max-lg:grid-cols-[230px_minmax(0,_1fr)] max-lg:gap-6 max-md:grid-cols-1 max-md:gap-7">
        <aside className="min-w-0" aria-label={t('animalProfile')}>
          <div className="max-md:flex max-md:items-center max-md:gap-5">
            <button type="button" className="relative w-full aspect-[1.15] grid place-items-center bg-portrait rounded-portrait cursor-pointer
              [&>span:first-child]:text-[76px] [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:rounded-[inherit]
              dark:bg-portrait-dark max-md:flex-[0_0_100px] max-md:w-25 max-md:h-28 max-md:rounded-[20px] max-md:aspect-auto
              max-md:[&>span:first-child]:text-[48px]" onClick={() => avatarRef.current?.click()}
              disabled={uploading} aria-label={t('changePhoto')}>
              {pet.avatarUrl
                ? <img src={pet.avatarUrl} alt={pet.name} />
                : <span aria-hidden="true">{speciesEmoji[pet.species] || '🐾'}</span>}
              <span className="absolute end-3 bottom-3 grid place-items-center w-11 h-11 rounded-full text-[#272335] bg-[#fffffff2]
              text-[24px] shadow-[0_2px_10px_#00000010] max-md:w-7.5 max-md:h-7.5 max-md:bottom-[5px] max-md:end-[5px]
              max-md:text-[20px]" aria-hidden="true">+</span>
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-label={t('changePhoto')} onChange={handleAvatarUpload} />
            <div className="mt-6 [&>p:first-child]:capitalize [&_h1]:text-[34px] [&_h1]:font-[650] [&_h1]:tracking-[-1px]
              [&_h1]:leading-[1.2] [&_h1]:wrap-anywhere [&>p:last-child:not(:first-child)]:text-muted
              [&>p:last-child:not(:first-child)]:mt-2 [&>p:last-child:not(:first-child)]:text-[15px]
              [&>p:last-child:not(:first-child)]:wrap-anywhere max-md:mt-0 max-md:min-w-0 max-md:[&_h1]:text-[30px]">
              <p className="text-muted text-[12px] font-medium mb-2">{t(pet.species)}</p>
              <h1>{pet.name}</h1>
              {pet.breed && <p>{pet.breed}</p>}
            </div>
          </div>
          {uploading && <p role="status" className="text-muted text-[14px] mt-2.5">{t('saving')}</p>}
          <dl className="[&_dt]:text-[12px] [&_dt]:text-muted grid grid-cols-3 gap-3 py-6 mt-6 border-y border-line [&_dd]:mt-1.5
              [&_dd]:text-[14px] [&_dd]:font-semibold [&_dd]:wrap-anywhere max-md:mt-5 max-md:py-5">
            {details.map(({ label, value }) => (
              <div key={label}><dt>{t(label)}</dt><dd><bdi>{value}</bdi></dd></div>
            ))}
          </dl>
          {pet.notes && <div className="py-6 border-b border-line [&_h2]:text-[12px] [&_h2]:font-medium [&_h2]:text-muted [&_h2]:mb-2 [&_p]:text-[14px]
              [&_p]:leading-[1.7] [&_p]:whitespace-pre-wrap [&_p]:wrap-anywhere max-md:py-5"><h2>{t('notes')}</h2><p>{pet.notes}</p></div>}
          <div className="flex flex-wrap gap-2.5 pt-6 [&>*]:flex-1 max-md:pt-5">
            <Link to={`/pets/${id}/edit`} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t('editProfile')}</Link>
            <button type="button" onClick={handleDelete} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] disabled:opacity-[0.55] disabled:cursor-wait text-[#a52940] dark:text-[#fda4af]
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass">{t('deleteAnimal')}</button>
          </div>
        </aside>
        <div className="min-w-0">
          <div className="hidden max-md:flex max-md:items-center max-md:justify-between max-md:gap-3 max-md:mb-4
              max-md:[&_label]:text-[18px] max-md:[&_label]:font-semibold max-md:[&_select]:min-w-0
              max-md:[&_select]:max-w-[70%] max-md:[&_select]:pe-7 max-md:[&_select]:text-[16px]">
            <label htmlFor="record-section">{t('records')}</label>
            <select id="record-section" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" value={activeTab} onChange={event => setActiveTab(event.target.value)}>
              {visibleTabs.map(tab => <option key={tab} value={tab}>{t(tab)}</option>)}
            </select>
          </div>
          <nav className="flex flex-wrap gap-1 p-1.5 mb-5 bg-surface border border-line rounded-card max-md:hidden" aria-label={t('records')}>
            {visibleTabs.map(tab => (
              <button type="button" key={tab} className="min-h-11 py-2.5 px-3.5 rounded-xl text-muted text-[13px] cursor-pointer transition-[background-color,color]
              duration-[160ms] ease-[ease] aria-pressed:text-action aria-pressed:bg-[#ede9fe] aria-pressed:font-semibold
              dark:aria-pressed:text-[#ddd6fe] dark:aria-pressed:bg-[#3b2c57] hover:aria-[pressed=false]:text-ink
              hover:aria-[pressed=false]:bg-canvas"
                aria-pressed={activeTab === tab} aria-controls="record-content" onClick={() => setActiveTab(tab)}>
                {t(tab)}
              </button>
            ))}
          </nav>
          <div id="record-content" className="min-w-0 p-6.5 bg-surface border border-line rounded-panel max-lg:p-5 max-md:py-5 max-md:px-4
              max-md:rounded-card max-md:[&_:is(button,input:not([type='checkbox']),select)]:min-h-11
              max-md:[&_button]:min-w-11 max-md:[&_:is(input:not([type='checkbox']),textarea,select)]:text-[16px]" role="region" aria-label={t(activeTab)}>
            {recordTab && (
              <div lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}>
                {activeTab === 'guide' && <SpeciesGuide key={id} pet={pet} language={language} />}
                {activeTab === 'quality' && <RecordQuality key={id} petId={id} petName={pet.name} language={language} />}
                {activeTab === 'dairy' && <DairyRecords key={id} petId={id} language={language} />}
              </div>
            )}
        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-6">
            <MealLog petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <WeightLog petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <Suspense fallback={<p role="status" className="text-muted py-12 text-center">{t('load')}</p>}>
              <WeightChart petId={id} petName={pet.name} />
            </Suspense>
            <hr className="border-gray-100 dark:border-gray-800" />
            <VetVisits petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <Reminders petId={id} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <PhotoGallery petId={id} />
          </div>
        )}
        {activeTab === 'Meals' && <MealLog petId={id} />}
        {activeTab === 'Weight' && <WeightLog petId={id} />}
        {activeTab === 'Chart' && (
          <Suspense fallback={<p role="status" className="text-muted py-12 text-center">{t('load')}</p>}>
              <WeightChart petId={id} petName={pet.name} />
            </Suspense>
        )}
        {activeTab === 'Vet Visits' && <VetVisits petId={id} />}
        {activeTab === 'Reminders' && <Reminders petId={id} />}
        {activeTab === 'AI Chat' && (
          <Suspense fallback={<p role="status" className="text-muted py-12 text-center">{t('load')}</p>}>
            <Chat key={id} pet={pet} />
          </Suspense>
        )}
        {activeTab === 'Photos' && <PhotoGallery petId={id} />}
          </div>
        </div>
      </div>
    </div>
  )
}
