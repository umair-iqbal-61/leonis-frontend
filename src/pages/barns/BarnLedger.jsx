import { useEffect, useRef, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { useLanguage } from '../../hooks/useLanguage'
import { barnText, barnError, barnToday, barnDay, barnMoney, barnCategories, barnInput, barnButton, barnPrimary } from '../../lib/barn'

function EntryForm({ barn, entry, animals, close, refresh }) {
  const { language } = useLanguage(), t = key => barnText(language, key)
  const [form, setForm] = useState(entry ? { ...entry, occurredOn: barnDay(entry.occurredOn), petId: entry.petId == null ? entry.animalReference != null ? 'deleted' : '' : String(entry.petId), quantity: entry.quantity ?? '', receipt: entry.receipt ?? '' }
    : { occurredOn: barnToday(), category: 'MILK_SALE', petId: '', amount: '', quantity: '', description: '', receipt: '' })
  const [busy, setBusy] = useState(false), [error, setError] = useState('')
  const request = useRef(null)
  const update = field => event => { setForm(current => ({ ...current, [field]: event.target.value, ...(field === 'category' ? { quantity: '' } : {}) })); request.current = null }
  return <form className="grid gap-5 max-w-190 border-y border-line py-7 my-7" onSubmit={async event => {
    event.preventDefault(); if (busy) return; setBusy(true); setError(''); request.current ??= crypto.randomUUID()
    try {
      await apiFetch(`/barns/${barn.id}/entries${entry ? `/${entry.id}` : ''}`, { method: entry ? 'PATCH' : 'POST', body: JSON.stringify({ ...form, petId: form.petId === '' || form.petId === 'deleted' ? null : Number(form.petId), keepDeletedAnimal: form.petId === 'deleted', requestId: request.current, expectedVersion: entry?.version }) })
      close(); refresh()
    } catch (error) { setError(barnError(error)) } finally { setBusy(false) }
  }}>
    <h3 className="text-xl font-semibold">{t(entry ? 'editEntry' : 'addEntry')}</h3><p className="text-muted text-sm leading-relaxed">{t('entryHint')}</p>
    {error && <p role="alert" className="text-rose-700 dark:text-rose-300">{t(error)}</p>}
    <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2 min-w-0">
      <label className="grid gap-2 text-sm min-w-0">{t('category')}<select className={barnInput} value={form.category} onChange={update('category')}>{barnCategories.map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label>
      <label className="grid gap-2 text-sm min-w-0">{t('occurredOn')}<input className={barnInput} type="date" required max={barnToday()} value={form.occurredOn} onChange={update('occurredOn')} /></label>
      <label className="grid gap-2 text-sm min-w-0">{t('animal')}<select className={barnInput} value={form.petId} onChange={update('petId')} required={['ANIMAL_PURCHASE', 'ANIMAL_SALE'].includes(form.category)}><option value="">{t('shared')}</option>{entry?.petId == null && entry?.animalReference != null && <option value="deleted">{entry.animalName} ({t('deleted')})</option>}{animals.map(animal => <option key={animal.id} value={animal.id}>{animal.name}</option>)}</select></label>
      <label className="grid gap-2 text-sm min-w-0">{t('amount')}<input className={barnInput} type="number" min="0.01" max="9999999999.99" step="0.01" required inputMode="decimal" value={form.amount} onChange={update('amount')} /></label>
      {['MILK_SALE', 'FEED'].includes(form.category) && <label className="grid gap-2 text-sm min-w-0">{t(form.category === 'MILK_SALE' ? 'milkQuantity' : 'feedQuantity')}<input className={barnInput} type="number" min="0.001" max="9999999.999" step="0.001" inputMode="decimal" required={form.category === 'MILK_SALE'} value={form.quantity} onChange={update('quantity')} /></label>}
      <label className="grid gap-2 text-sm min-w-0">{t('receipt')}<input className={barnInput} maxLength={150} value={form.receipt} onChange={update('receipt')} /></label>
      <label className="grid gap-2 text-sm sm:col-span-2">{t('description')}<textarea className={`${barnInput} min-h-24 resize-y`} maxLength={1000} required value={form.description} onChange={update('description')} /></label>
    </fieldset>
    <p className="text-muted text-sm">{t('animalRequired')}</p><div className="flex gap-3 flex-wrap"><button className={barnPrimary} disabled={busy}>{t(busy ? 'saving' : 'save')}</button><button className={barnButton} type="button" disabled={busy} onClick={close}>{t('cancel')}</button></div>
  </form>
}
function PaymentForm({ barnId, entry, close, refresh }) {
  const { language } = useLanguage(), t = key => barnText(language, key)
  const [form, setForm] = useState({ paidOn: barnToday(), amount: '', note: '' }), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const request = useRef(null)
  return <form className="grid gap-4 mt-5 border-s-2 border-accent ps-4 max-w-170" onSubmit={async event => {
    event.preventDefault(); if (busy) return; setBusy(true); setError(''); request.current ??= crypto.randomUUID()
    try { await apiFetch(`/barns/${barnId}/entries/${entry.id}/payments`, { method: 'POST', body: JSON.stringify({ ...form, requestId: request.current }) }); close(); refresh() }
    catch (error) { setError(barnError(error)) } finally { setBusy(false) }
  }}><h4 className="font-semibold">{t('addPayment')}</h4><p className="text-sm text-muted">{t('paymentHelp')}</p>
    {error && <p role="alert" className="text-rose-700 dark:text-rose-300">{t(error)}</p>}
    {[['paidOn', 'date'], ['amount', 'number'], ['note', 'text']].map(([field, type]) => <label key={field} className="grid gap-2 text-sm min-w-0">{t({ paidOn: 'paidOn', amount: 'paymentAmount', note: 'paymentNote' }[field])}<input className={barnInput} type={type} required={field !== 'note'} min={field === 'amount' ? '0.01' : undefined} max={field === 'amount' ? entry.outstanding : field === 'paidOn' ? barnToday() : undefined} step={field === 'amount' ? '0.01' : undefined} maxLength={field === 'note' ? 500 : undefined} disabled={busy} value={form[field]} onChange={event => { setForm(current => ({ ...current, [field]: event.target.value })); request.current = null }} /></label>)}
    <div className="flex gap-3 flex-wrap"><button className={barnPrimary} disabled={busy}>{t(busy ? 'saving' : 'save')}</button><button type="button" className={barnButton} disabled={busy} onClick={close}>{t('cancel')}</button></div>
  </form>
}
export default function BarnLedger({ barn, refresh, revision }) {
  const { language } = useLanguage(), t = (key, params) => barnText(language, key, params)
  const [data, setData] = useState(null), [page, setPage] = useState(1), [animal, setAnimal] = useState(''), [editing, setEditing] = useState(null), [payment, setPayment] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const animals = [...new Map(barn.memberships.filter(item => item.petId != null).map(item => [item.petId, { id: item.petId, name: item.pet?.name ?? item.animalName }])).values()]
  useEffect(() => {
    const controller = new AbortController()
    apiFetch(`/barns/${barn.id}/entries?page=${page}${animal ? `&animalReference=${animal}` : ''}`, { signal: controller.signal }).then(({ data }) => { if (!controller.signal.aborted) { setData({ ...data, animal }); setError('') } }).catch(error => { if (!controller.signal.aborted) setError(barnError(error)) })
    return () => controller.abort()
  }, [barn.id, page, animal, revision])
  async function action(path, expectedVersion) {
    if (busy) return
    setBusy(true); setError('')
    try { await apiFetch(path, { method: 'DELETE', body: JSON.stringify({ expectedVersion }) }); setPayment(null); setEditing(null); refresh() }
    catch (error) { setError(barnError(error)) } finally { setBusy(false) }
  }
  return <section className="min-w-0"><div className="flex justify-between items-center flex-wrap gap-3"><h2 className="text-xl font-semibold">{t('ledger')}</h2>{!barn.archived && <button className={barnPrimary} onClick={() => { setEditing('new'); setPayment(null) }}>{t('addEntry')}</button>}</div><p className="text-sm text-muted mt-3">{t('allDates')}</p>
    {editing && <EntryForm key={editing === 'new' ? 'new' : editing.id} barn={barn} entry={editing === 'new' ? null : editing} animals={animals} close={() => setEditing(null)} refresh={refresh} />}
    <label className="grid gap-2 text-sm max-w-150 mt-6">{t('filter')}<select className={barnInput} value={animal} onChange={event => { setAnimal(event.target.value); setPage(1); setEditing(null); setPayment(null) }}><option value="">{t('allAnimals')}</option>{[...new Map(barn.memberships.map(item => [item.animalReference, item])).values()].map(item => <option key={item.animalReference} value={item.animalReference}>{item.pet?.name ?? item.animalName}</option>)}</select></label>
    {error && <div role="alert" className="text-rose-700 dark:text-rose-300 my-5"><p>{t(error)}</p><button className={`${barnButton} mt-3`} onClick={() => { setEditing(null); setPayment(null); refresh() }}>{t('retry')}</button></div>}
    {data?.page !== page || data?.animal !== animal ? !error && <p role="status" className="mt-6">{t('loading')}</p> : !data.entries.length ? <p className="text-muted my-8">{t('noEntries')}</p> : <ul className="divide-y divide-line mt-6">{data.entries.map(entry => <li key={entry.id} className="py-6 min-w-0">
      <div className="flex justify-between items-start flex-wrap gap-3"><div className="min-w-0"><h3 className="font-semibold">{t(entry.category)}</h3><p className="text-sm text-muted mt-1"><bdi>{barnDay(entry.occurredOn)}</bdi> · {entry.animalName ?? t('shared')}</p></div><p className="font-semibold text-accent"><bdi>{barnMoney(entry.amount, language)}</bdi></p></div>
      <p className="mt-3 whitespace-pre-wrap wrap-anywhere">{entry.description}</p>{entry.quantity != null && <p className="text-sm text-muted mt-2"><bdi>{entry.quantity} {entry.unit === 'L' ? t('liters') : 'kg'}</bdi></p>}{entry.receipt && <p className="text-sm text-muted mt-2 wrap-anywhere">{entry.receipt}</p>}
      <dl className="grid grid-cols-2 gap-4 mt-4 text-sm"><div><dt className="text-muted">{t('paid')}</dt><dd className="mt-1"><bdi>{barnMoney(entry.paid, language)}</bdi></dd></div><div><dt className="text-muted">{t('due')}</dt><dd className="mt-1"><bdi>{barnMoney(entry.outstanding, language)}</bdi></dd></div></dl>
      <div className="flex flex-wrap gap-2 mt-5"><button className={barnButton} disabled={busy} onClick={() => { setEditing(entry); setPayment(null); window.scrollTo({ top: 0, behavior: 'instant' }) }}>{t('edit')}</button><button className={barnButton} disabled={busy || Number(entry.outstanding) <= 0} onClick={() => setPayment(entry.id)}>{t('addPayment')}</button><button className={barnButton} disabled={busy} onClick={() => { if (window.confirm(t('removeConfirm'))) action(`/barns/${barn.id}/entries/${entry.id}`, entry.version) }}>{t('remove')}</button></div>
      {payment === entry.id && <PaymentForm key={entry.id} barnId={barn.id} entry={entry} close={() => setPayment(null)} refresh={refresh} />}
      <details className="mt-5 text-sm"><summary className="cursor-pointer min-h-11 flex items-center text-muted">{t('paymentHistory')} ({entry.payments.length})</summary>{!entry.payments.length ? <p className="text-muted">{t('paymentEmpty')}</p> : <ul className="space-y-4 mt-3">{entry.payments.map(item => <li key={item.id} className="border-s border-line ps-4"><div className="flex flex-wrap justify-between gap-3"><p><bdi>{barnDay(item.paidOn)}</bdi></p><bdi>{barnMoney(item.amount, language)}</bdi></div>{item.note && <p className="mt-2 wrap-anywhere">{item.note}</p>}<button className={`${barnButton} mt-3`} disabled={busy} onClick={() => { if (window.confirm(t('paymentDeleteConfirm'))) action(`/barns/${barn.id}/entries/${entry.id}/payments/${item.id}`, entry.version) }}>{t('paymentDelete')}</button></li>)}</ul>}</details>
    </li>)}</ul>}
    {data && data.total > 20 && <nav className="flex items-center justify-between gap-3 mt-7"><button className={barnButton} disabled={page <= 1} onClick={() => setPage(value => value - 1)}>{t('previous')}</button><span>{t('page', { page })}</span><button className={barnButton} disabled={page * 20 >= data.total} onClick={() => setPage(value => value + 1)}>{t('next')}</button></nav>}
  </section>
}
