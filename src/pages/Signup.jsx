import { useState } from 'react'
import { apiFetch } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'


export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { token } = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        })
      })

      localStorage.setItem('token', token)
      navigate('/dashboard')
      setLoading(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const inputClass = "border dark:border-gray-700 rounded-lg px-4 py-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create your account 🐾</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" value={username}
            onChange={e => setUsername(e.target.value)} className={inputClass} required />
          <input type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={e => setPassword(e.target.value)} className={inputClass} required minLength={6} />
          <button type="submit" disabled={loading}
            className="bg-violet-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Have an account?{' '}
          <Link to="/login" className="text-violet-600 dark:text-violet-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}