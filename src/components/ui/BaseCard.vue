<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href || undefined"
    :target="target"
    :rel="href ? computedRel : undefined"
    class="group block overflow-hidden rounded-lg bg-white p-0 shadow-lg ring-1 ring-gray-200 transition hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-gray-800 dark:ring-gray-700"
  >
    <div class="aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="imageAlt || title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <slot name="image" v-else />
    </div>

    <div class="p-5">
      <h3 class="mb-2 line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">
        <slot name="title">{{ title }}</slot>
      </h3>
      <p class="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
        <slot name="description">{{ description }}</slot>
      </p>

      <div v-if="href" class="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 transition group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300">
        <span>Learn more</span>
        <svg class="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BaseCardProps {
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  title: '',
  description: '',
  imageSrc: '',
  imageAlt: '',
  href: '',
  target: '_blank',
  rel: 'noopener noreferrer',
})

const computedRel = computed(() => {
  // Ensure we always include security-related rel attributes when opening new tabs
  const defaults = ['noopener', 'noreferrer']
  const custom = (props.rel || '').split(/\s+/).filter(Boolean)
  const merged = new Set([...defaults, ...custom])
  return Array.from(merged).join(' ')
})
</script>

<style scoped>
/* Support for line-clamp without requiring plugin */
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
