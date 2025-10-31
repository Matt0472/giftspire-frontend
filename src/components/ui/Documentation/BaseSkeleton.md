# BaseSkeleton Component

A lightweight, reusable loading placeholder component with three shapes: rectangular blocks, pill (chip-like), and multi-line text. It respects light/dark themes and uses Tailwind's `animate-pulse`.

## Features

- Rect, pill, and multi-line (lines) shapes
- Theme-aware colors (light/dark)
- Accessible by default (`aria-hidden="true"`)
- Easy sizing via utility classes
- Zero dependencies, Tailwind-based

## Usage

### Rectangular block
```vue
<template>
  <div class="space-y-4">
    <BaseSkeleton inner-class="h-6 w-48" />
    <BaseSkeleton inner-class="h-40 w-full" />
  </div>
</template>
```

### Pill (chip placeholder)
```vue
<template>
  <div class="flex flex-wrap gap-2">
    <BaseSkeleton shape="pill" class="inline-block" inner-class="h-9 w-24" />
    <BaseSkeleton shape="pill" class="inline-block" inner-class="h-9 w-32" />
    <BaseSkeleton shape="pill" class="inline-block" inner-class="h-9 w-20" />
  </div>
</template>
```

### Multi-line text
```vue
<template>
  <div>
    <BaseSkeleton shape="lines" />
  </div>
</template>
```

## Props

- `shape?: 'rect' | 'pill' | 'lines'` — Skeleton form; default: `'rect'`.
- `rounded?: string` — Tailwind rounding class for `rect` shape; default: `'rounded-lg'`.
- `lines?: number` — Number of rows when `shape='lines'`; default: `3`.
- `class?: string` — Classes applied to the wrapper (which holds the `animate-pulse`).
- `innerClass?: string` — Additional classes applied to the inner block (for `rect` and `pill`, e.g., `h-9 w-24`).

## Accessibility

Skeletons are decorative and not focusable. The wrapper sets `aria-hidden="true"`. Avoid placing interactive elements within skeletons.

## Styling notes

- Colors: `bg-gray-200 dark:bg-gray-700`
- Animation: Tailwind `animate-pulse`
- Compose sizes with Tailwind (`w-*`, `h-*`) via `class`/`innerClass` props.

## Example in Dashboard (chips loading)
```vue
<template>
  <div class="flex flex-wrap gap-2">
    <BaseSkeleton
      v-for="(w, i) in ['w-24','w-28','w-32']"
      :key="i"
      shape="pill"
      class="inline-block"
      :inner-class="`h-9 ${w}`"
    />
  </div>
</template>
```