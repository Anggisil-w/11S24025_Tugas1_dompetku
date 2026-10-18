<script setup>
// Menggunakan v-model pada props melalui defineModel (fitur Vue 3.4+) atau manual emit untuk kompatibilitas luas
const props = defineProps({
  selectedType: String,
  selectedMonth: String
})

const emit = defineEmits(['update:selectedType', 'update:selectedMonth'])
</script>

<template>
  <div class="card">
    <h2>Filter Transaksi</h2>
    <div class="filter-flex">
      <div>
        <label>Jenis</label>
        <select :value="selectedType" @input="emit('update:selectedType', $event.target.value)">
          <option value="">Semua Jenis</option>
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
      </div>
      <div>
        <label>Bulan</label>
        <input type="month" :value="selectedMonth" @input="emit('update:selectedMonth', $event.target.value)" />
      </div>
    </div>
  </div>
</template>