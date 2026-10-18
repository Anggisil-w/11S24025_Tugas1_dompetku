// Mengubah angka menjadi teks Rupiah, contoh: 1500000 -> 'Rp 1.500.000'
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
})

export function formatRupiah(value) {
  return formatter.format(value)
}
