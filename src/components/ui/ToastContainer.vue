<template>
  <div
    aria-live="polite"
    aria-atomic="true"
    class="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none"
    style="max-width: 420px; width: 100%"
  >
    <transition-group
      name="toast-list"
      tag="div"
      class="space-y-4"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <BaseToast
          :variant="toast.variant"
          :title="toast.title"
          :message="toast.message"
          :dismissible="toast.dismissible"
          :auto-close="toast.autoClose"
          :duration="toast.duration"
          @close="toastStore.removeToast(toast.id)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import BaseToast from './BaseToast.vue'

const toastStore = useToastStore()
</script>

<style scoped>
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-list-leave-active {
  position: absolute;
}
</style>
