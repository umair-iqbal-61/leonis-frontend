import PublicLayout from '../components/PublicLayout'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'
import { useState } from 'react'
import { apiFetch } from '../lib/api'
import { Link } from 'react-router-dom'


export default function Signup({ setSession }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
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
      setSession(token)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <PublicLayout showLogin={false}>
      <div className="animate-workspace-enter motion-reduce:animate-none max-w-115 mt-18 mx-auto mb-0 pt-6 px-6 pb-16
              [&_h1]:text-[clamp(30px,_5vw,_38px)] [&_h1]:font-[650] [&_h1]:tracking-[-1px] [&_h1]:leading-[1.25] max-md:mt-6
              max-md:pt-6 max-md:px-5 max-md:pb-12">
        <h1>{t('createAccount')}</h1>
        <p className="text-muted text-[14px] mt-2.5">{t('authDescription')}</p>
        {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
        <form onSubmit={handleSignup} className="grid gap-5 text-ink rounded-panel [&_label]:grid [&_label]:gap-2 [&_label]:min-w-0 [&_label]:text-[14px]
              [&_label]:font-medium [&_:is(input,select,textarea)]:block [&_:is(input,select,textarea)]:w-full
              [&_:is(input,select,textarea)]:min-w-0 [&_:is(input,select,textarea)]:min-h-12
              [&_:is(input,select,textarea)]:py-[11px] [&_:is(input,select,textarea)]:px-[13px]
              [&_:is(input,select,textarea)]:text-ink [&_:is(input,select,textarea)]:bg-canvas
              [&_:is(input,select,textarea)]:border [&_:is(input,select,textarea)]:border-line
              [&_:is(input,select,textarea)]:rounded-xl [&_:is(input,select,textarea)]:[font-family:inherit]
              [&_:is(input,select,textarea)]:text-[16px] [&_:is(input,select,textarea)]:font-normal
              [&_:is(input,select,textarea)]:leading-[1.5] [&_textarea]:resize-y [&_textarea]:min-h-26
              [&>div:last-child]:pt-3 [&>div:last-child]:border-t [&>div:last-child]:border-line p-0 bg-transparent border-0
              mt-8 [&>button[type='submit']]:mt-2 max-md:py-5 max-md:px-4 max-md:gap-4.5">
          <label>{t('username')}
            <input type="text" name="username" autoComplete="username" value={username}
              onChange={event => setUsername(event.target.value)} required />
          </label>
          <label>{t('password')}
            <input type="password" name="password" autoComplete="new-password" value={password}
              onChange={event => setPassword(event.target.value)} required minLength={6} />
          </label>
          <p className="text-muted text-[13px] leading-[1.7]">{t('passwordHint')}</p>
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t(loading ? 'pleaseWait' : 'createAccount')}</button>
        </form>
        <p className="mt-7 text-muted text-[14px] [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-[3px]">{t('haveAccount')} <Link to="/login">{t('login')}</Link></p>
      </div>
    </PublicLayout>
  )
}
