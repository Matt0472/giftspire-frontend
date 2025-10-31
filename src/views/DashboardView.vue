<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back, <span class="gradient-text">{{ authStore.user?.display_name }}</span>!
      </h1>
    </div>

    <!-- Quick Chips Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('dashboard.quickChips.title') }}</h2>

      <div class="mb-4">
        <div class="flex flex-wrap gap-2">
          <template v-if="loading">
            <BaseSkeleton
              v-for="(w, i) in skeletonWidths"
              :key="i"
              shape="pill"
              class="inline-block"
              :inner-class="`h-9 ${w}`"
            />
          </template>
          <template v-else>
            <BaseChip
              v-for="chip in chips"
              :key="chip.key"
              :variant="chip.variant"
              :label="t(chip.labelTKey)"
              @click="handleChipClick(t(chip.promptTKey))"
            />
          </template>
        </div>
        <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseChip from '@/components/ui/BaseChip.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import type { ChipVariant } from '@/components/ui/BaseChip.vue'

const authStore = useAuthStore()
const { t } = useI18n()

interface ChipDef {
  key: string
  labelTKey: string
  promptTKey: string
  variant: ChipVariant
}

// Raw JSON item shape (loose, for type-safe parsing)
interface RawChip {
  key: unknown
  labelTKey: unknown
  promptTKey: unknown
  variant: unknown
}

const chips = ref<ChipDef[] | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const skeletonWidths = ['w-24','w-28','w-32','w-20','w-36','w-24','w-28','w-20','w-32','w-24','w-28','w-36']

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/quick-start-chips.json`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Failed to load quick chips: ${res.status}`)
    const data: unknown = await res.json()
    // Basic runtime validation
    if (!Array.isArray(data)) throw new Error('Invalid quick chips format')
    const allowed: ChipVariant[] = ['accent1','accent2','accent3']
    chips.value = (data as RawChip[]).map((item) => ({
      key: String(item.key ?? ''),
      labelTKey: String(item.labelTKey ?? ''),
      promptTKey: String(item.promptTKey ?? ''),
      variant: allowed.includes(item.variant as ChipVariant) ? (item.variant as ChipVariant) : 'accent1',
    })) as ChipDef[]
  } catch (e: unknown) {
    console.error(e)
    error.value = 'Failed to load quick actions.'
    chips.value = []
  } finally {
    loading.value = false
  }
})

function handleChipClick(prompt: string) {
  // Navigation will be implemented later; for now, simply log the chosen prompt
  // eslint-disable-next-line no-console
  console.log('[QuickChip]', prompt)
}
</script>
