import { useState } from 'react'
import { apiFetch } from '../lib/api'

export function useChat(petContext) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async (text, petId) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setLoading(true)
    setError('')

    try {
      const data = await apiFetch(`/pets/${petId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ messages: updatedMessages, petContext })
      })

      const reply = data.content?.[0]?.text
      if (!reply) throw new Error(`No reply returned. Raw: ${JSON.stringify(data)}`)

      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setError(`Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([])

  return { messages, loading, error, sendMessage, clearChat }
}