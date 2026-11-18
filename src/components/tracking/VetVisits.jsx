import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'

export default function VetVisits({ petId }) {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ reason: '', vetName: '', visitDate: '', nextVisit: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const fetchVisits = async () => {
    try {
      const { data } = await apiFetch(`/pets/${petId}/vetvisits`, { method: "GET" })

      setVisits(data || [])
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    apiFetch(`/pets/${petId}/vetvisits`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setVisits(data || [])
      })
      .catch(error => {
        if (!controller.signal.aborted) setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [petId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await apiFetch(`/pets/${petId}/vetvisits`, {
        method: "POST",
        body: JSON.stringify({
          ...form
        })
      })

      setForm({ reason: '', vetName: '', visitDate: '', nextVisit: '', notes: '' })
      setShowForm(false)
      setAdding(false)
      fetchVisits()
    } catch (error) {
      setError(error.message)
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/pets/${petId}/vetvisits/${id}`, {
        method: 'DELETE'
      })

      fetchVisits()
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const inputClass = "border dark:border-gray-700 rounded-xl px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
  const labelClass = "text-xs text-gray-500 dark:text-gray-400 mb-1 block"
  const isUpcoming = (date) => date && new Date(date) > new Date()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">🏥 Vet Visits</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
          + Add Visit
        </button>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input className={inputClass} placeholder="Reason *" value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
          <input className={inputClass} placeholder="Vet name" value={form.vetName}
            onChange={e => setForm(f => ({ ...f, vetName: e.target.value }))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Visit date *</label>
              <input className={inputClass} type="date" value={form.visitDate}
                onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))} required />
            </div>
            <div>
              <label className={labelClass}>Next visit</label>
              <input className={inputClass} type="date" value={form.nextVisit}
                onChange={e => setForm(f => ({ ...f, nextVisit: e.target.value }))} />
            </div>
          </div>
          <input className={inputClass} placeholder="Notes" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={adding}
              className="flex-1 bg-amber-500 text-white rounded-xl py-1.5 text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
              {adding ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-6">No vet visits logged yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {visits.map(visit => (
            <div key={visit.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{visit.reason}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(visit.visitDate).toLocaleDateString([], { dateStyle: 'medium' })}
                    {visit.vetName && ` · ${visit.vetName}`}
                  </p>
                  {visit.nextVisit && (
                    <p className={`text-xs mt-1 font-medium ${isUpcoming(visit.nextVisit)
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-gray-400 dark:text-gray-600'
                      }`}>
                      Next: {new Date(visit.nextVisit).toLocaleDateString([], { dateStyle: 'medium' })}
                      {isUpcoming(visit.nextVisit) && ' ⏰'}
                    </p>
                  )}
                  {visit.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{visit.notes}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(visit.id)}
                  className="text-xs text-red-300 hover:text-red-500 dark:text-red-700 dark:hover:text-red-400 ml-4 transition-colors">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}