<script setup>
import { useToast } from '../composables/useToast'

const { toasts, dismissToast } = useToast()
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="`toast-${t.type}`"
      role="status"
    >
      <span>{{ t.message }}</span>
      <button type="button" class="toast-close" aria-label="Tutup" @click="dismissToast(t.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  z-index: 1000;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 360px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.toast-success { background: #16a34a; }
.toast-info    { background: #2563eb; }
.toast-danger  { background: #dc2626; }
.toast-close {
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}
</style>
