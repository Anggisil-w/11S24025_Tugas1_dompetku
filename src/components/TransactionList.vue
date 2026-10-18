<script setup>
defineProps({
  transactions: Array,
  formatRupiah: Function
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="card">
    <h2>Daftar Transaksi</h2>
    <div v-if="transactions.length === 0" style="text-align: center; color: var(--text-muted); padding: 20px;">
      Belum ada transaksi tercatat.
    </div>
    <div v-else>
      <div v-for="t in transactions" :key="t.id" class="transaction-item">
        <div class="t-info">
          <h4>{{ t.description }}</h4>
          <span class="t-meta">{{ t.category }} | {{ t.date }}</span>
        </div>
        <div class="t-actions">
          <span :class="t.type === 'pemasukan' ? 'text-income' : 'text-expense'" style="font-weight: bold; font-size: 0.95rem; margin-right: 8px;">
            {{ t.type === 'pemasukan' ? '+' : '-' }} {{ formatRupiah(t.amount) }}
          </span>
          <button class="btn-sm btn-edit" @click="emit('edit', t)">Edit</button>
          <button class="btn-sm btn-delete" @click="emit('delete', t.id)">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>