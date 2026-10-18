<script setup>
import { ref, computed } from 'vue'
import { useTransactions } from './composables/useTransactions'
import TransactionForm from './components/TransactionForm.vue'
import TransactionList from './components/TransactionList.vue'
import SummaryCard from './components/SummaryCard.vue'
import FilterBar from './components/FilterBar.vue'
import CategoryReport from './components/CategoryReport.vue'

// Memanggil composable data keuangan
const { transactions, formatRupiah, saveTransaction, deleteTransaction } = useTransactions()

// State untuk filter dan mode edit
const filterType = ref('')
const filterMonth = ref('')
const editingTransactionData = ref(null)

// Computed untuk memfilter transaksi berdasarkan jenis dan bulan
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const matchType = filterType.value ? t.type === filterType.value : true
    const matchMonth = filterMonth.value ? t.date.startsWith(filterMonth.value) : true
    return matchType && matchMonth
  })
})

// Computed untuk ringkasan berdasarkan transaksi yang sedang difilter
const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

// Handler Form Submit (Tambah / Update)
const handleFormSubmit = (data) => {
  const editId = editingTransactionData.value ? editingTransactionData.value.id : null
  saveTransaction(data, editId)
  editingTransactionData.value = null
}

const handleEdit = (transaction) => {
  editingTransactionData.value = transaction
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleCancelEdit = () => {
  editingTransactionData.value = null
}
</script>

<template>
  <div class="container">
    <header>
      <h1>DompetKu</h1>
      <p>Aplikasi Pencatat Keuangan Pribadi Sederhana</p>
    </header>

    <main>
      <!-- Form Tambah / Edit -->
      <TransactionForm 
        :editing-transaction="editingTransactionData"
        @submit-form="handleFormSubmit"
        @cancel-edit="handleCancelEdit"
      />

      <!-- Ringkasan Keuangan -->
      <SummaryCard 
        :total-income="totalIncome"
        :total-expense="totalExpense"
        :balance="balance"
        :formatRupiah="formatRupiah"
      />

      <!-- Filter Bar -->
      <FilterBar 
        v-model:selectedType="filterType"
        v-model:selectedMonth="filterMonth"
      />

      <!-- Grafik Kategori Pengeluaran -->
      <CategoryReport 
        :transactions="filteredTransactions"
        :formatRupiah="formatRupiah"
      />

      <!-- Daftar Transaksi -->
      <TransactionList 
        :transactions="filteredTransactions"
        :formatRupiah="formatRupiah"
        @edit="handleEdit"
        @delete="deleteTransaction"
      />
    </main>
  </div>
</template>