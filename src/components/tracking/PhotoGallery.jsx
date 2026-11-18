import { useLanguage } from '../../hooks/useLanguage'
import { recordText } from '../../lib/recordLanguage'
import { useEffect, useState, useRef } from 'react'
import { apiFetch } from '../../lib/api'

export default function PhotoGallery({ petId }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()
  const dialogRef = useRef()

  useEffect(() => {
    if (preview) dialogRef.current?.showModal()
  }, [preview])

  const fetchPhotos = async () => {
    try {
      const { data } = await apiFetch(`/pets/${petId}/photos`, {
        method: 'GET',
      })
      setPhotos(data || [])
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    apiFetch(`/pets/${petId}/photos`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setPhotos(data || [])
      })
      .catch(error => {
        if (!controller.signal.aborted) setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [petId])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    setUploading(true)
    try {
      await apiFetch(`/pets/${petId}/photos`, {
        method: 'POST',
        body: formData
      })

      fetchPhotos()
    } catch (error) {
      setError(error.message)
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  const handleDelete = async (photo) => {
    if (!confirm(t('confirmPhotoDelete'))) return
    try {
      await apiFetch(`/pets/${petId}/photos/${photo.id}`, { method: 'DELETE' })
      fetchPhotos()
      if (preview?.id === photo.id) setPreview(null)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <section className="min-w-0 [&_button]:min-w-11 [&_button]:min-h-11 [&_:is(input,select,textarea)]:max-w-full [&_.flex]:min-w-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 [&_h3]:text-ink [&_h3]:text-[17px] [&_h3]:font-semibold
              [&_[role='alert']]:[flex-basis:100%] max-md:[&_h3]:text-[16px]">
        <h3>{t('Photos')}</h3>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">
          {t(uploading ? 'uploading' : 'addPhoto')}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        className="sr-only" tabIndex={-1} aria-label={t('addPhoto')} onChange={handleUpload} />
      {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      {loading ? <p role="status" className="text-muted py-12 text-center">{t('load')}</p> : photos.length === 0 ? (
        <button type="button" className="flex flex-col items-center justify-center gap-2.5 w-full min-h-45 p-6 text-muted bg-canvas border border-dashed border-line rounded-2xl cursor-pointer" disabled={uploading} onClick={() => fileRef.current?.click()}>
          <span>{t('firstPhoto')}</span><small>{t('photoFormats')}</small>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
          {photos.map(photo => (
            <button type="button" key={photo.id} className="overflow-hidden aspect-square rounded-control cursor-pointer [&_img]:w-full [&_img]:h-full [&_img]:object-cover
              [&_img]:transition-[transform] [&_img]:duration-[180ms] [&_img]:ease-[ease] hover:[&_img]:scale-[1.03]" onClick={() => setPreview(photo)}
              aria-label={t('openPhoto') + (photo.title ? ': ' + photo.title : '')}>
              <img src={photo.url} alt={photo.title || t('animalPhoto')} loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {preview && (
        <dialog ref={dialogRef} className="w-[min(640px,_calc(100%_-_32px))] max-h-[calc(100svh_-_32px)] m-auto overflow-auto p-0 text-ink bg-surface
              border border-line rounded-panel [&::backdrop]:bg-[#111019b3] [&>img]:w-full [&>img]:max-h-[65svh]
              [&>img]:object-contain [&>img]:bg-canvas" onClose={() => setPreview(null)} aria-label={t('animalPhoto')}>
          <img src={preview.url} alt={preview.title || t('animalPhoto')} />
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              {preview.title && <p>{preview.title}</p>}
              <p className="text-muted text-[13px] leading-[1.7]">{new Date(preview.createdAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-GB', { dateStyle: 'medium' })}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2.5 max-md:[&>button]:flex-1">
              <button type="button" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] disabled:opacity-[0.55] disabled:cursor-wait text-[#a52940] dark:text-[#fda4af]
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" onClick={() => handleDelete(preview)}>{t('remove')}</button>
              <button type="button" autoFocus className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" onClick={() => dialogRef.current.close()}>{t('close')}</button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  )
}
