import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'

export default function MealLog({ petId }) {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', amount: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const fetchMeals = async () => {
    try {
      const { data } = await apiFetch(`/pets/${petId}/meals`, {
        method: "GET"
      })
      setMeals(data || [])
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    apiFetch(`/pets/${petId}/meals`, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setMeals(data || [])
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

    try {
      setAdding(true)
      await apiFetch(`/pets/${petId}/meals`, {
        method: "POST",
        body: JSON.stringify({
          ...form
        })
      })

      setForm({ name: '', amount: '', notes: '' })
      setShowForm(false)
      setAdding(false)
      fetchMeals()
    } catch (error) {
      setError(error.message)
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/pets/${petId}/meals/${id}`, {
        method: "DELETE"
      })

      fetchMeals()
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const inputClass = "border dark:border-gray-700 rounded-xl px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">🍽️ Meal Log</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
          + Add Meal
        </button>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input className={inputClass} placeholder="Food name *"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <input className={inputClass} placeholder="Amount (e.g. 1 cup)"
            value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <input className={inputClass} placeholder="Notes (optional)"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={adding}
              className="flex-1 bg-violet-600 text-white rounded-xl py-1.5 text-sm hover:bg-violet-700 disabled:opacity-50 transition-colors">
              {adding ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
      ) : meals.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-6">No meals logged yet</p>
      ) : (
        <div className="flex flex-col gap-2">
              {meals.map(log => (
            <div key={log.id}
              className="flex justify-between items-start bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{log.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {log.amount && `${log.amount} · `}
                  {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                {log.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.notes}</p>}
              </div>
              <button onClick={() => handleDelete(log.id)}
                className="text-xs text-red-300 hover:text-red-500 dark:text-red-700 dark:hover:text-red-400 ml-4 transition-colors">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}