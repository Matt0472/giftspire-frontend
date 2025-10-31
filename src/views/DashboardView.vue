<template>
  <div>
    <div class="full-bleed -mt-8">
      <ChipsJumbotron
        :skeleton-widths="skeletonWidths"
      />
    </div>

    <!-- Loading State - Simple line skeletons -->
    <div v-if="isLoading" class="mt-8 space-y-6">
      <BaseSkeleton shape="rect" inner-class="h-8 w-64" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-96" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-80" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-72" />
      <BaseSkeleton shape="rect" inner-class="h-6 w-88" />
    </div>

    <!-- Trending Sections - Hidden but mounted during loading -->
    <div :class="{ 'opacity-0 h-0 overflow-hidden': isLoading }">
      <TrendingProducts
        category="tech"
        :limit="4"
        title="Tech & Gadgets"
        :animation-delay="0"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="fashion"
        :limit="4"
        title="Fashion & Accessories"
        :animation-delay="100"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="home"
        :limit="4"
        title="Home & Kitchen"
        :animation-delay="200"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="sports"
        :limit="4"
        title="Sports & Outdoors"
        :animation-delay="300"
        @loaded="handleSectionLoaded"
      />

      <TrendingProducts
        category="books"
        :limit="4"
        title="Books & Hobbies"
        :animation-delay="400"
        @loaded="handleSectionLoaded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChipsJumbotron from '@/components/Dashboard/ChipsJumbotron.vue'
import TrendingProducts from '@/components/Dashboard/TrendingProducts.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'

const skeletonWidths = ['w-24','w-28','w-32','w-20','w-36','w-24','w-28','w-20','w-32','w-24','w-28','w-36']

const isLoading = ref(true)
const loadedSections = ref(0)
const totalSections = 5

const handleSectionLoaded = () => {
  loadedSections.value++
  if (loadedSections.value >= totalSections) {
    isLoading.value = false
  }
}
</script>

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
