import { useSyncExternalStore } from 'react'
const key = 'leonis-store-cart'
const subscribe = callback => {
  window.addEventListener('storage', callback); window.addEventListener('leonis-cart', callback)
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('leonis-cart', callback) }
}
const snapshot = () => localStorage.getItem(key) || '[]'
export function readCart() {
  try {
    const value = JSON.parse(snapshot())
    return Array.isArray(value) ? value.filter(item => Number.isInteger(item?.productId) && item.productId > 0 && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99)
      .filter((item, index, all) => all.findIndex(other => other.productId === item.productId) === index).slice(0, 20) : []
  } catch { return [] }
}
export function writeCart(items) { localStorage.setItem(key, JSON.stringify(items)); window.dispatchEvent(new Event('leonis-cart')) }
export function useCart() {
  useSyncExternalStore(subscribe, snapshot, () => '[]')
  const items = readCart()
  function add(productId) {
    const current = readCart(), existing = current.find(item => item.productId === productId)
    if ((existing && existing.quantity >= 99) || (!existing && current.length >= 20)) return false
    writeCart(existing ? current.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId, quantity: 1 }])
    return true
  }
  function quantity(productId, value) {
    if (!Number.isInteger(value) || value < 1 || value > 99) return
    writeCart(readCart().map(item => item.productId === productId ? { ...item, quantity: value } : item))
  }
  return { items, add, quantity, remove: id => writeCart(readCart().filter(item => item.productId !== id)), clear: () => writeCart([]) }
}
