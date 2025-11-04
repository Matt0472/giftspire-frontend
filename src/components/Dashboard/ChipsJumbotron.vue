<script setup lang="ts">
import BaseChip from '@/components/ui/BaseChip.vue'
import HeroJumbotron from '@/components/ui/HeroJumbotron.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import StarryBackground from '@/components/ui/StarryBackground.vue'
import type { ChipVariant } from '@/components/ui/BaseChip.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useGiftSearch } from '@/composables/useGiftSearch'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'

interface ChipDef {
  key: string
  labelTKey: string
  promptTKey: string
  variant: ChipVariant
}

interface RawChip {
  key: unknown
  labelTKey: unknown
  promptTKey: unknown
  variant: unknown
}
interface ChipsJumbotronProps {
  skeletonWidths: string[]
}

defineProps<ChipsJumbotronProps>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const { t } = useI18n()
const { searchFromChip, isLoading: isSearching } = useGiftSearch()

async function handleChipClick(chipKey: string, chipPrompt: string) {
  console.log('[QuickChip] Clicked:', chipKey, chipPrompt)
  try {
    await searchFromChip(chipKey, chipPrompt)
  } catch (error) {
    // Error is already handled in the composable
    console.error('Chip search failed:', error)
  }
}

const chips = ref<ChipDef[] | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)



onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/quick-start-chips.json`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Failed to load quick chips: ${res.status}`)
    const data: unknown = await res.json()
    if (!Array.isArray(data)) throw new Error('Invalid quick chips format')
    const allowed: ChipVariant[] = ['accent1', 'accent2', 'accent3']
    chips.value = (data as RawChip[]).map((item) => ({
      key: String(item.key ?? ''),
      labelTKey: String(item.labelTKey ?? ''),
      promptTKey: String(item.promptTKey ?? ''),
      variant: allowed.includes(item.variant as ChipVariant)
        ? (item.variant as ChipVariant)
        : 'accent1',
    })) as ChipDef[]
  } catch (e: unknown) {
    console.error(e)
    error.value = t('dashboard.jumbo.loadError')
    chips.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <HeroJumbotron minHeight="md" gradientFrom="from-[#4b6cb7]" gradientTo="to-[#182848]">
    <template #background>
      <!-- Starry Background Animation -->
      <StarryBackground :star-count="150" color="#7c9fe8" speed="slow" :size="{ min: 1, max: 2 }" />
      <StarryBackground :star-count="100" color="#a8c0ff" speed="normal" :size="{ min: 1, max: 3 }" />
      <StarryBackground :star-count="80" color="#6b8dd6" speed="fast" :size="{ min: 0.5, max: 1.5 }" />
    </template>

    <template #left>
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
        {{ t('dashboard.jumbo.welcomeBackPrefix') }}<span class="gradient-text">{{ user?.display_name }}</span>{{ t('dashboard.jumbo.welcomeBackSuffix') }}
      </h1>
      <h2 class="text-2xl md:text-3xl font-semibold text-white mb-3">
        {{ t('dashboard.jumbo.title') }}
      </h2>
      <p class="text-white/90 md:text-lg">
        {{ t('dashboard.jumbo.subtitle') }}
      </p>
    </template>
    <template #right>
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
            :disabled="isSearching"
            @click="handleChipClick(chip.key, t(chip.promptTKey))"
          />
        </template>
      </div>
      <p v-if="error" class="mt-2 text-sm text-red-200">{{ error }}</p>
    </template>
  </HeroJumbotron>
</template>

<style scoped></style>
