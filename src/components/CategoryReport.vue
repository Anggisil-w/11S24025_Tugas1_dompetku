<script setup>
import { computed } from 'vue'

const props = defineProps({
  transactions: Array,
  formatRupiah: Function
})

// Menghitung total pengeluaran per kategori secara reaktif
const categoryExpenses = computed(() => {
  const map = {}
  props.transactions
    .filter(t => t.type === 'pengeluaran')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return map
})

// Menghitung total keseluruhan pengeluaran untuk persentase bar chart CSS
const totalExpenseAmount = computed(() => {
  return Object.values(categoryExpenses.value).reduce((acc, val) => acc + val, 0)
})

const getPercentage = (amount) => {
  if (totalExpenseAmount.value === 0) return 0
  return Math.round((amount / totalExpenseAmount.value) * 100)
}
</script>

<template>
  <div class="card">
    <h2>Pengeluaran per Kategori</h2>
    <div v-if="Object.keys(categoryExpenses).length === 0" style="text-align: center; color: var(--text-muted); padding: 20px;">
      Belum ada data pengeluaran untuk kategori.
    </div>
    <div v-else>
      <div v-for="(amount, category) in categoryExpenses" :key="category" class="category-bar-container">
        <div class="category-info">
          <span><strong>{{ category }}</strong></span>
          <span>{{ formatRupiah(amount) }} ({{ getPercentage(amount) }}%)</span>
        </div>
        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: getPercentage(amount) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>