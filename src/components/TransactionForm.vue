<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  editingTransaction: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit-form', 'cancel-edit'])

// Helper untuk mendapatkan tanggal lokal saat ini (YYYY-MM-DD)
const getTodayDate = () => new Date().toLocaleDateString('sv-SE')

// State lokal formulir
const description = ref('')
const amount = ref('')
const type = ref('pengeluaran')
const category = ref('Makanan')
const date = ref(getTodayDate())

const errors = ref({})

// Daftar kategori pilihan berdasarkan jenis
const categories = computed(() => {
  if (type.value === 'pemasukan') {
    return ['Gaji', 'Freelance', 'Hadiah', 'Lainnya']
  } else {
    return ['Makanan', 'Transportasi', 'Pendidikan', 'Hiburan', 'Tagihan', 'Lainnya']
  }
})

// 1. Definisikan resetForm TERLEBIH DAHULU sebelum dipanggil di watch
const resetForm = () => {
  description.value = ''
  amount.value = ''
  type.value = 'pengeluaran'
  category.value = 'Makanan'
  date.value = getTodayDate()
  errors.value = {}
}

// 2. Watch dijalankan setelah resetForm terdefinisi
watch(
  () => props.editingTransaction,
  (val) => {
    if (val) {
      description.value = val.description
      amount.value = val.amount
      type.value = val.type
      category.value = val.category
      date.value = val.date
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Validasi input manual sebelum emit
const validate = () => {
  errors.value = {}
  if (!description.value.trim()) {
    errors.value.description = 'Deskripsi tidak boleh kosong.'
  }
  if (!amount.value || Number(amount.value) <= 0) {
    errors.value.amount = 'Nominal harus berupa angka lebih dari 0.'
  }
  if (!date.value) {
    errors.value.date = 'Tanggal wajib diisi.'
  }
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validate()) return

  emit('submit-form', {
    description: description.value.trim(),
    amount: Number(amount.value), // Disimpan sebagai number
    type: type.value,
    category: category.value,
    date: date.value
  })

  if (!props.editingTransaction) {
    resetForm()
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel-edit')
}
</script>

<template>
  <div class="card">
    <h2>{{ editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Deskripsi</label>
        <input type="text" v-model="description" placeholder="Contoh: Makan siang di kantin" />
        <span class="error-msg" v-if="errors.description">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label>Nominal (Rp)</label>
        <input type="number" v-model="amount" placeholder="Contoh: 25000" min="1" />
        <span class="error-msg" v-if="errors.amount">{{ errors.amount }}</span>
      </div>

      <div class="form-group">
        <label>Jenis</label>
        <select v-model="type">
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
      </div>

      <div class="form-group">
        <label>Kategori</label>
        <select v-model="category">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tanggal</label>
        <input type="date" v-model="date" />
        <span class="error-msg" v-if="errors.date">{{ errors.date }}</span>
      </div>

      <button type="submit" class="btn">
        {{ editingTransaction ? 'Simpan Perubahan' : 'Tambah Transaksi' }}
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        v-if="editingTransaction"
        @click="handleCancel"
      >
        Batal
      </button>
    </form>
  </div>
</template>