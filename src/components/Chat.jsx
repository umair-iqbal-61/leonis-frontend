import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChat } from '../hooks/useChat'
import { useLanguage } from '../hooks/useLanguage'
import { recordText } from '../lib/recordLanguage'

export default function Chat({ pet }) {
  const [input, setInput] = useState('')
  const messagesRef = useRef(null)
  const { language } = useLanguage()
  const t = (key, parameters) => recordText(language, key, parameters)
  const { messages, loading, error, sendMessage, clearChat } = useChat()

  useEffect(() => {
    const container = messagesRef.current
    if (!container) return
    container.scrollTo({
      top: container.scrollHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }, [messages, loading])

  function submit(event) {
    event.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input, pet.id)
    setInput('')
  }

  return (
    <section className="flex flex-col h-[min(700px,_75svh)] min-h-107.5 max-md:h-[72svh] max-md:min-h-105">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 [&_h3]:text-ink [&_h3]:text-[17px] [&_h3]:font-semibold
              [&_[role='alert']]:[flex-basis:100%] max-md:[&_h3]:text-[16px]">
        <div>
          <h3>{t('chatTitle')}</h3>
          <p className="text-muted text-[13px] leading-[1.7]">{t('chatDescription')}</p>
        </div>
        {messages.length > 0 && <button type="button" className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" onClick={clearChat} disabled={loading}>{t('clearChat')}</button>}
      </div>
      <div className="flex-1 min-h-0 overflow-auto overscroll-contain flex flex-col gap-5 pt-2 px-1 pb-6 [scrollbar-width:thin]" ref={messagesRef} role="log" aria-label={t('AI Chat')} aria-relevant="additions">
        {messages.length === 0 ? (
          <div className="my-auto py-6 [&_h4]:text-[22px] [&_h4]:font-medium">
            <h4>{t('chatEmpty', { name: pet.name })}</h4>
            <div className="grid gap-2.5 mt-6 [&_button]:justify-start [&_button]:text-start">
              {['chatRecords', 'chatUncertain'].map(key => (
                <button type="button" key={key} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] text-ink disabled:opacity-[0.55] disabled:cursor-wait
              hover:bg-surface hover:shadow-[inset_0_1px_0_#ffffff55,0_5px_14px_#27233512] glass" onClick={() => sendMessage(t(key, { name: pet.name }), pet.id)} disabled={loading}>
                  {t(key, { name: pet.name })}
                </button>
              ))}
            </div>
          </div>
        ) : messages.map((message, index) => (
          <div key={index} className={`min-w-0 text-[15px] leading-[1.75] wrap-anywhere max-md:text-[14px] ${message.role === 'user'
            ? 'self-end max-w-[88%] py-3 px-4 text-white bg-action rounded-[18px_18px_4px_18px] whitespace-pre-wrap'
            : 'self-stretch max-w-full text-ink'}`} dir="auto">
            {message.role === 'user' ? <p>{message.content}</p> : (
              <div className="[&>:first-child]:mt-0 [&_:is(p,ul,ol,blockquote,pre,table)]:my-3 [&_:is(h1,h2,h3,h4,h5,h6)]:mt-5
              [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:text-[17px] [&_:is(h1,h2,h3,h4,h5,h6)]:font-[650]
              [&_:is(ul,ol)]:ps-6 [&_ul]:list-disc [&_ol]:list-decimal [&_li+li]:mt-1.5 [&_a]:text-accent [&_a]:underline
              [&_blockquote]:ps-4 [&_blockquote]:border-s-[3px] [&_blockquote]:border-line [&_blockquote]:text-muted
              [&_pre]:overflow-auto [&_pre]:p-3.5 [&_pre]:rounded-[10px] [&_pre]:bg-canvas [&_pre]:text-[13px]
              [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-canvas
              [&_:not(pre)>code]:text-[0.9em] [&_table]:w-full [&_table]:border-collapse [&_table]:text-[13px]
              [&_:is(th,td)]:min-w-27.5 [&_:is(th,td)]:p-2.5 [&_:is(th,td)]:text-start [&_:is(th,td)]:align-top
              [&_:is(th,td)]:border [&_:is(th,td)]:border-line [&_th]:bg-canvas">
                <Markdown remarkPlugins={[remarkGfm]} skipHtml disallowedElements={['img']} components={{
                  table: ({ children }) => (
                    <div className="max-w-full overflow-x-auto [scrollbar-width:thin]" role="region" tabIndex={0} aria-label={t('tableContent')}>
                      <table>{children}</table>
                    </div>
                  ),
                }}>{message.content}</Markdown>
              </div>
            )}
          </div>
        ))}
        {loading && <p role="status" className="text-muted text-[13px] leading-[1.7]">{t('thinking')}</p>}
        {error && <p role="alert" className="border-s-[3px] border-[#be123c] py-3 px-4 mb-6 text-[#a52940] bg-[#fff1f2] rounded-lg wrap-anywhere dark:bg-[#411b29] dark:text-[#fecdd3]">{error}</p>}
      </div>
      <form onSubmit={submit} className="[&_input]:block [&_input]:w-full [&_input]:min-w-0 [&_input]:min-h-12 [&_input]:py-[11px] [&_input]:px-[13px]
              [&_input]:text-ink [&_input]:bg-canvas [&_input]:border [&_input]:border-line [&_input]:rounded-xl
              [&_input]:[font-family:inherit] [&_input]:text-[16px] [&_input]:font-normal [&_input]:leading-[1.5] flex
              gap-2.5 pt-4 border-t border-line [&_input]:flex-1 max-md:gap-2 max-md:[&>button[type='submit']]:px-3">
        <label htmlFor="chat-input" className="sr-only">{t('chatInput')}</label>
        <input id="chat-input" value={input} onChange={event => setInput(event.target.value)}
          placeholder={t('chatPrompt', { name: pet.name })} disabled={loading} autoComplete="off" />
        <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center justify-center gap-2 min-w-11 min-h-11 py-2.5 px-[17px] rounded-control text-[14px]
              font-semibold leading-[1.4] cursor-pointer transition-[background-color,border-color,box-shadow,transform]
              duration-[160ms] ease-[ease] bg-action text-white border border-action shadow-[0_4px_10px_#6d28d91a]
              dark:bg-action-dark dark:border-action-dark hover:bg-[#5b21b6] hover:-translate-y-px disabled:opacity-[0.6]
              disabled:cursor-wait disabled:transform-none">{t('send')}</button>
      </form>
    </section>
  )
}
