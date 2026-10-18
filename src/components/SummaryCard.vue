<script setup>
defineProps({
  totalIncome: Number,
  totalExpense: Number,
  balance: Number,
  formatRupiah: Function
})
</script>

<template>
  <div class="card">
    <h2>Ringkasan Keuangan</h2>
    <div class="summary-grid">
      <div class="summary-box">
        <h3>Total Pemasukan</h3>
        <p class="text-income">{{ formatRupiah(totalIncome) }}</p>
      </div>
      <div class="summary-box">
        <h3>Total Pengeluaran</h3>
        <p class="text-expense">{{ formatRupiah(totalExpense) }}</p>
      </div>
      <div class="summary-box" style="grid-column: 1 / -1;">
        <h3>Saldo Akhir</h3>
        <p :style="{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }">
          {{ formatRupiah(balance) }}
        </p>
      </div>
    </div>
  </div>
</template>