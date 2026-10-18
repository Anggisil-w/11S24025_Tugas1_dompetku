import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'dompetku-transactions'

// Fungsi helper untuk memformat angka ke mata uang Rupiah
export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number)
}

// Memastikan satu item transaksi punya bentuk yang benar
function isValidTransaction(t) {
  return (
    t !== null &&
    typeof t === 'object' &&
    typeof t.description === 'string' &&
    Number.isFinite(t.amount) && t.amount > 0 &&
    (t.type === 'pemasukan' || t.type === 'pengeluaran') &&
    typeof t.category === 'string' &&
    typeof t.date === 'string'
  )
}

// Membaca data dari localStorage; jika rusak/kosong/tidak valid, kembalikan array kosong dengan try...catch
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidTransaction)
  } catch (e) {
    console.error('Data localStorage korup atau gagal diparsing, memakai data kosong.', e)
    return []
  }
}

export function useTransactions() {
  const transactions = ref(loadFromStorage())
  const filterType = ref('semua')   // 'semua' | 'pemasukan' | 'pengeluaran'
  const filterMonth = ref('')       // format 'YYYY-MM', kosong = semua bulan

  // Sinkronisasi otomatis ke localStorage dengan try...catch untuk mengamankan setItem
  watch(
    transactions,
    (newValue) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
      } catch (e) {
        console.error('Gagal menyimpan data ke localStorage.', e)
      }
    },
    { deep: true }
  )

  // Daftar transaksi setelah filter, diurutkan dari yang terbaru
  const filteredTransactions = computed(() =>
    transactions.value
      .filter((t) => filterType.value === 'semua' || t.type === filterType.value)
      .filter((t) => !filterMonth.value || t.date.startsWith(filterMonth.value))
      .sort((a, b) => b.date.localeCompare(a.date))
  )

  const sumByType = (type) =>
    filteredTransactions.value
      .filter((t) => t.type === type)
      .reduce((total, t) => total + t.amount, 0)

  const totalIncome = computed(() => sumByType('pemasukan'))
  const totalExpense = computed(() => sumByType('pengeluaran'))
  const balance = computed(() => totalIncome.value - totalExpense.value)

  // Total pengeluaran per kategori, untuk laporan
  const categoryTotals = computed(() => {
    const totals = {}
    for (const t of filteredTransactions.value) {
      if (t.type !== 'pengeluaran') continue
      totals[t.category] = (totals[t.category] || 0) + t.amount
    }
    return Object.entries(totals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
  })

  // Fungsi saveTransaction untuk mengakomodasi pemanggilan saveTransaction(data, editId) dari App.vue
  function saveTransaction(data, editId = null) {
    if (editId !== null) {
      const index = transactions.value.findIndex((t) => t.id === editId)
      if (index !== -1) {
        transactions.value[index] = { id: editId, ...data }
      }
    } else {
      transactions.value.unshift({ id: crypto.randomUUID(), ...data })
    }
  }

  function addTransaction(data) {
    transactions.value.unshift({ id: crypto.randomUUID(), ...data })
  }

  function updateTransaction(id, data) {
    const index = transactions.value.findIndex((t) => t.id === id)
    if (index !== -1) transactions.value[index] = { id, ...data }
  }

  function deleteTransaction(id) {
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  return {
    transactions,
    filterType,
    filterMonth,
    filteredTransactions,
    totalIncome,
    totalExpense,
    balance,
    categoryTotals,
    saveTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    formatRupiah
  }
}