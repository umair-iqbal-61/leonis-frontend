import AnimalForm from '../../components/AnimalForm'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'

export default function EditPet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', species: 'dog', breed: '',
    age: '', weight: '', gender: 'male', notes: ''
  })

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await apiFetch(`/pets/${id}`, { method: 'GET' })
        setForm({
          name: data.name || '',
          species: data.species || 'dog',
          breed: data.breed || '',
          age: data.age ?? '',
          weight: data.weight ?? '',
          gender: data.gender ?? '',
          notes: data.notes || ''
        })
        setLoading(false)
      } catch (error) {
        setError(error.message)
        navigate('/dashboard')
        setLoading(false)
      }
    }
    fetchPet()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setSaving(true)
      await apiFetch(`/pets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...form,
          gender: form.gender || null,
          age: form.age === '' ? null : Number(form.age),
          weight: form.weight === '' ? null : Number(form.weight),
        })
      })

      navigate(`/pets/${id}`)
    } catch (error) {
      setError(error.message)
      setSaving(false)
    }
  }

  if (loading) return <p role="status" className="text-muted py-12 text-center">{t('load')}</p>

  return (
    <div className="animate-workspace-enter motion-reduce:animate-none max-w-170 mx-auto">
      <button type="button" onClick={() => navigate('/pets/' + id)} className="inline-flex items-center gap-2.5 min-h-11 mb-6 text-muted text-[14px] max-md:mb-4">
        <span aria-hidden="true">{language === 'ur' ? '→' : '←'}</span> {t('back')}
      </button>
      <div className="flex items-center justify-between gap-5 mb-8 [&_h1]:text-[clamp(28px,_4vw,_40px)] [&_h1]:leading-[1.2]
              [&_h1]:font-[650] [&_h1]:tracking-[-1.4px] max-md:items-end max-md:gap-3 max-md:mb-6 max-md:[&_h1]:text-[30px]
              max-md:[&_.primary-control]:px-3 max-md:[&_.primary-control]:whitespace-nowrap max-[360px]:items-start
              max-[360px]:flex-col"><h1>{t('editProfile')}</h1></div>
      {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      <AnimalForm form={form} setForm={setForm} onSubmit={handleSubmit} busy={saving}
        onCancel={() => navigate('/pets/' + id)} />
    </div>
  )
}
