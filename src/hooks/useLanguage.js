import { useSyncExternalStore } from 'react'

const eventName = 'leonis-language-change'

function subscribe(callback) {
  window.addEventListener(eventName, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(eventName, callback)
    window.removeEventListener('storage', callback)
  }
}

function snapshot() {
  return localStorage.getItem('record-language') === 'ur' ? 'ur' : 'en'
}

function setLanguage(language) {
  localStorage.setItem('record-language', language === 'ur' ? 'ur' : 'en')
  window.dispatchEvent(new Event(eventName))
}

export function useLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot)
  return { language, setLanguage }
}
