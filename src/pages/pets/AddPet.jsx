import AnimalForm from '../../components/AnimalForm'
import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../lib/api'

export default function AddPet() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', species: 'dog', breed: '',
    age: '', weight: '', gender: 'male', notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      await apiFetch('/pets', {
        method: "POST",
        body: JSON.stringify({
          ...form,
          gender: form.gender || null,
          age: form.age === '' ? null : Number(form.age),
          weight: form.weight === '' ? null : Number(form.weight),
        })
      })

      navigate('/dashboard')
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="animate-workspace-enter motion-reduce:animate-none max-w-170 mx-auto">
      <button type="button" onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2.5 min-h-11 mb-6 text-muted text-[14px] max-md:mb-4">
        <span aria-hidden="true">{language === 'ur' ? '→' : '←'}</span> {t('back')}
      </button>
      <div className="flex items-center justify-between gap-5 mb-8 [&_h1]:text-[clamp(28px,_4vw,_40px)] [&_h1]:leading-[1.2]
              [&_h1]:font-[650] [&_h1]:tracking-[-1.4px] max-md:items-end max-md:gap-3 max-md:mb-6 max-md:[&_h1]:text-[30px]
              max-md:[&_.primary-control]:px-3 max-md:[&_.primary-control]:whitespace-nowrap max-[360px]:items-start
              max-[360px]:flex-col"><h1>{t('addAnimal')}</h1></div>
      {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      <AnimalForm form={form} setForm={setForm} onSubmit={handleSubmit} busy={loading}
        onCancel={() => navigate('/dashboard')} />
    </div>
  )
}
