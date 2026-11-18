import SpeciesGuide from '../../components/tracking/SpeciesGuide'
import DairyRecords from '../../components/tracking/DairyRecords'
import RecordQuality from '../../components/tracking/RecordQuality'
import { recordText } from '../../lib/recordLanguage'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import MealLog from '../../components/tracking/MealLog'
import WeightLog from '../../components/tracking/WeightLog'
import VetVisits from '../../components/tracking/VetVisits'
import Reminders from '../../components/tracking/Reminders'
import Chat from '../../components/Chat'
import WeightChart from '../../components/tracking/WeightChart'
import { useRef } from 'react'
import PhotoGallery from '../../components/tracking/PhotoGallery'
import { apiFetch } from '../../lib/api'

const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', bird: '🐦', fish: '🐟', rabbit: '🐰', 'dairy-cattle': '🐄', other: '🐾' }
const TABS = ['Overview', 'Meals', 'Weight', 'Chart', 'Vet Visits', 'Reminders', 'Photos', 'AI Chat']

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const [language, setLanguage] = useState(() => localStorage.getItem('record-language') === 'ur' ? 'ur' : 'en')
  const avatarRef = useRef()

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    try {
      const { data: newAvatar } = await apiFetch(`/pets/${id}/avatar`, { method: 'POST', body: formData })

      setPet(p => ({ ...p, avatarUrl: newAvatar.avatarUrl }))
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const { data } = await apiFetch(`/pets/${id}`, { method: "GET" })
        setPet(data)

        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleDelete = async () => {
    try {
      setLoading(true)
      await apiFetch(`/pets/${id}`, {
        method: "DELETE"
      })
      navigate('/dashboard')
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
    </div>
  )

  if (!pet) return null

  const recordTabs = ['quality', 'guide']
  if (pet.species === 'dairy-cattle') recordTabs.push('dairy')
  const recordTab = recordTabs.includes(activeTab)
  const emoji = SPECIES_EMOJI[pet.species] || '🐾'

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/dashboard')}
        className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 flex items-center gap-1 transition-colors">
        ← Back
      </button>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Pet header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-3xl shrink-0 cursor-pointer relative group overflow-hidden"
            onClick={() => avatarRef.current?.click()}>
            {pet.avatarUrl
              ? <img src={pet.avatarUrl} className="w-full h-full object-cover" alt={pet.name} />
              : <span>{emoji}</span>
            }
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs">📷</span>
            </div>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{pet.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
              {recordText(language, pet.species)}{pet.breed ? ` · ${pet.breed}` : ''}
            </p>
          </div>
          <div className="flex gap-3 sm:gap-4 text-center shrink-0">
            {pet.age && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Age</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{pet.age}y</p>
              </div>
            )}
            {pet.weight && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Weight</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{pet.weight}kg</p>
              </div>
            )}
            {pet.gender && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Gender</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize">{pet.gender}</p>
              </div>
            )}
          </div>
        </div>

        {pet.notes && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-3">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-0.5">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{pet.notes}</p>
          </div>
        )}

        {/* Edit and Delete Pet Button */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <Link to={`/pets/${id}/edit`}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
            Edit profile
          </Link>
          <button onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-colors">
            Delete {pet.name}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4 overflow-x-auto">
        {[...TABS, ...recordTabs].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab
              ? 'bg-white dark:bg-gray-900 text-violet-700 dark:text-violet-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
            {recordText(language, tab)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        {recordTab && (
          <div lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'} className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              {recordText(language, 'language')}
              <select className="rounded border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800" value={language} onChange={event => {
                localStorage.setItem('record-language', event.target.value)
                setLanguage(event.target.value)
              }}>
                <option value="en">English</option>
                <option value="ur">اردو</option>
              </select>
            </label>
            {activeTab === 'guide' && <SpeciesGuide pet={pet} language={language} />}
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
            <WeightChart petId={id} petName={pet.name} />
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
          <WeightChart petId={id} petName={pet.name} />
        )}
        {activeTab === 'Vet Visits' && <VetVisits petId={id} />}
        {activeTab === 'Reminders' && <Reminders petId={id} />}
        {activeTab === 'AI Chat' && <Chat key={id} pet={pet} />}
        {activeTab === 'Photos' && <PhotoGallery petId={id} />}

      </div>
    </div>
  )
}