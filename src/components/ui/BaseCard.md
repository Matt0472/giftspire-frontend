# BaseCard Component

A reusable, clickable card component for dashboards and lists. Supports image, title, description, and optional external link behavior.

## Features

- ✅ Optional clickable behavior with `href` (opens in new tab by default)
- ✅ Image area with 16:9 aspect ratio
- ✅ Title and description props, with slots to fully customize content
- ✅ Accessible focus styles and secure external links (`rel="noopener noreferrer"`)
- ✅ Works in light and dark modes
- ✅ Smooth hover/scale effects on the image

## Basic Usage

```vue
<template>
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
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
</script>
```

## Props

- `title?: string` — Card title text
- `description?: string` — Card description paragraph
- `imageSrc?: string` — Image URL shown in a 16:9 container
- `imageAlt?: string` — Image alt text (defaults to `title`)
- `href?: string` — When provided, the whole card becomes a link
- `target?: '_self' | '_blank' | '_parent' | '_top'` — Defaults to `'_blank'`
- `rel?: string` — Additional rel attributes; `noopener noreferrer` are enforced by default

## Slots

- `#image` — Replace the image area with custom content
- `#title` — Custom title content
- `#description` — Custom description content

```vue
<template>
  <BaseCard href="https://github.com/your-org/your-repo">
    <template #image>
      <div class="aspect-[16/9] flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30">
        <svg class="h-12 w-12 text-indigo-600 dark:text-indigo-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.25 1.85 1.25 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.62-2.67-.31-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.7.25 2.96.12 3.27.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.63-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 .5z"/>
        </svg>
      </div>
    </template>
    <template #title>GitHub Repository</template>
    <template #description>Star, fork, and contribute to the project on GitHub.</template>
  </BaseCard>
</template>
```

## Accessibility Notes

- When `href` is provided, the component renders an anchor so the entire card is keyboard-navigable.
- Focus and hover states are visually indicated; external links use `rel="noopener noreferrer"` to mitigate security risks.

## Styling

The component uses Tailwind CSS utility classes consistent with the rest of the UI kit. You can wrap it with additional containers for layout or override classes via parent containers if necessary.
