# BaseChip Component

A reusable, accessible chip (pill) component with animated gradient outlines. Uses neutral visual variants (accent1, accent2, accent3) — each with its own animated gradient, matching the app's visual language.

## Features

- ✅ Clickable chip with button or anchor semantics (`as="button" | "a"`)
- ✅ Variants with distinct animated gradient outlines: `accent1`, `accent2`, `accent3`
- ✅ Sizes: `sm`, `md`
- ✅ Disabled state
- ✅ Slot or `label` prop for content
- ✅ Keyboard accessible (Enter key activation)
- ✅ Works in light and dark modes
- ✅ Safe external link attributes when rendered as anchor

## Basic Usage

```vue
<template>
  <div class="flex flex-wrap gap-2">
    <BaseChip label="Gift for friend" @click="pick('Gift ideas for a close friend')" />
    <BaseChip label="Tech & Gadgets" variant="accent2" @click="pick('Gift ideas for someone who loves tech and gadgets')" />
    <BaseChip label="Birthday" variant="accent3" @click="pick('Birthday gift ideas for any age')" />
  </div>
</template>

<script setup lang="ts">
import BaseChip from '@/components/ui/BaseChip.vue'

function pick(prompt: string) {
  console.log('[Chip]', prompt)
}
</script>
```

## Props

- `label?: string` — Text content of the chip (can be replaced by default slot)
- `variant?: 'accent1' | 'accent2' | 'accent3'` — Determines the animated gradient style; default: `'accent1'`
- `size?: 'sm' | 'md'` — Chip size; default: `'md'`
- `disabled?: boolean` — Disabled state; default: `false`
- `as?: 'button' | 'a'` — Render as a native button or anchor; default: `'button'`
- `href?: string` — Anchor href (only used when `as='a'`)
- `target?: '_self' | '_blank' | '_parent' | '_top'` — Anchor target; default: `'_self'`
- `rel?: string` — Additional rel attributes; `noopener noreferrer` are enforced by default

## Slots

- `default` — Custom chip content. If provided, it overrides the `label` prop.

```vue
<template>
  <BaseChip variant="accent2">
    <span class="inline-flex items-center">
      <svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.59L8.41 12 10 10.41l3 3 5-5L19.59 10 13 16.59z" />
      </svg>
      Verified Picks
    </span>
  </BaseChip>
</template>
```

## Accessibility Notes

- When `as='button'` (default), the component behaves as a button and is activatable with the Enter key.
- When `as='a'` and `href` is set, the wrapper renders an anchor for native keyboard navigation.
- Focus is indicated via a visible ring (`focus-visible:ring-2`).
- When disabled, the chip becomes non-interactive and uses `cursor-not-allowed` and reduced opacity.

## Styling and Animation

Animated gradient outlines are provided via utility classes in `src/main.css`:

- `.animated-gradient-border--accent1` — Violet/Indigo/Pink
- `.animated-gradient-border--accent2` — Teal/Emerald/Cyan
- `.animated-gradient-border--accent3` — Amber/Rose/Fuchsia

All variants reuse the global `@keyframes gradient-shift` for a smooth, consistent effect and respect `prefers-reduced-motion`.

Internally the component uses a 2px gradient wrapper with a rounded inner element. The inner retains the surface color (`bg-white` or `dark:bg-gray-900`) so the animated border remains visible.

## Render as Link

```vue
<template>
  <BaseChip
    as="a"
    href="https://example.com/guide"
    target="_blank"
    rel="nofollow"
    label="Gift Guide"
    variant="accent2"
  />
</template>
```

Security-related rel attributes (`noopener noreferrer`) are automatically merged with any custom `rel` provided.

## Internationalization

Use translation keys in your pages and pass localized strings to `label`, or provide a localized slot. Example in a page:

```vue
<BaseChip :label="t('dashboard.quickChips.events.birthday.label')" variant="accent3" />
```

## Notes

- To add new gradient families, define an additional utility in `src/main.css` (e.g., `.animated-gradient-border--brandX`) and map it in the component when adding a new `variant`.
- Keep labels short to avoid overflow; the chip will wrap naturally when placed in a flex container with `flex-wrap`.
