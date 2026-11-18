import { Component } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'

function ErrorFallback({ onRetry }) {
  const { language } = useLanguage()
  const t = key => recordText(language, key)
  return (
    <main lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="grid min-h-svh place-items-center bg-canvas px-5 py-12 font-sans text-ink
        [&:lang(ur)]:font-urdu [&:lang(ur)]:leading-[1.8]">
      <div className="w-full max-w-110 text-center">
        <p className="mb-8 font-sans text-3xl font-bold tracking-tight text-accent" dir="ltr">leonis.</p>
        <h1 className="text-3xl font-semibold">{t('screenError')}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">{t('refreshHint')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onRetry}
            className="glass inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2.5 text-sm font-semibold
              focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent">{t('tryAgain')}</button>
          <a href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-control bg-action px-4 py-2.5 text-sm font-semibold text-white
              hover:bg-violet-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent">{t('goDashboard')}</a>
        </div>
      </div>
    </main>
  )
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}
