<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back, <span class="gradient-text">{{ authStore.user?.display_name }}</span>!
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        This is your personalized dashboard
      </p>
    </div>

    <!-- Quick Search Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Quick Search</h2>
      <div class="relative">
        <div class="animated-gradient-border rounded-lg p-[2px]">
          <input
            v-model="quickQuery"
            type="text"
            class="w-full rounded-lg border border-transparent bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            :placeholder="placeholderText"
            aria-label="Quick search"
          />
        </div>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          title="Gift Ideas Blog"
          description="Curated tips and stories to inspire your gift selections."
          image-src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop"
          href="https://example.com/blog"
        />
        <BaseCard
          title="Public Roadmap"
          description="See what's coming next and vote for features."
          image-src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop"
          href="https://example.com/roadmap"
        />
        <BaseCard
          title="Community"
          description="Join the conversation, ask questions, and share ideas."
          image-src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"
          href="https://example.com/community"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/ui/BaseCard.vue'

const authStore = useAuthStore()

// UI state for quick search input (no behavior wired yet)
const quickQuery = ref('')
const placeholderText = computed(() => {
  return "Ask anything, e.g., 'gift ideas for dad under $50' or 'birthday gift for a 10-year-old who loves LEGO'"
})
</script>
