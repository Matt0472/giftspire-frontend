<template>
  <div>
    <div class="full-bleed -mt-8">
      <ChipsJumbotron
        :skeleton-widths="skeletonWidths"
      />
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
import BaseCard from '@/components/ui/BaseCard.vue'
import type { ChipVariant } from '@/components/ui/BaseChip.vue'
import ChipsJumbotron from '@/components/Dashboard/ChipsJumbotron.vue'

const skeletonWidths = ['w-24','w-28','w-32','w-20','w-36','w-24','w-28','w-20','w-32','w-24','w-28','w-36']
</script>

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
