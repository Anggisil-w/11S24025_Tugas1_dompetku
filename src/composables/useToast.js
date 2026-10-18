import { ref } from 'vue'

// State dibuat di luar fungsi agar dipakai bersama oleh semua komponen
const toasts = ref([])
let nextId = 1

export function useToast() {
  function showToast(message, type = 'success', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => dismissToast(id), duration)
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, showToast, dismissToast }
}
