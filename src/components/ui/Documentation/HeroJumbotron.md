# HeroJumbotron

A flexible, reusable hero/jumbotron component with full-width gradient background, optional decorative backgrounds, and support for both two-column and centered single-column layouts.

## Features

- **Full-width gradient background** with customizable colors
- **Flexible layouts**: Two-column grid or centered single-column
- **Background slot** for decorative elements (e.g., StarryBackground)
- **Configurable height** with predefined size options
- **Responsive design** with proper padding and max-width constraints
- **Content alignment** that matches the application's layout system

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minHeight` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Minimum height of the jumbotron section |
| `gradientFrom` | `string` | `'from-indigo-600'` | Tailwind gradient start color class |
| `gradientTo` | `string` | `'to-purple-700'` | Tailwind gradient end color class |
| `noPadding` | `boolean` | `false` | *(Deprecated)* Remove internal padding |
| `centered` | `boolean` | `false` | Use centered single-column layout instead of two-column grid |

### Height Options

- `none`: No minimum height
- `sm`: 520px minimum height
- `md`: 640px minimum height (default)
- `lg`: 760px minimum height

## Slots

### Two-Column Layout (default)

- **`background`**: Optional slot for decorative background elements (e.g., animations)
- **`left`**: Content for the left column
- **`right`**: Content for the right column

### Centered Layout (`centered="true"`)

- **`background`**: Optional slot for decorative background elements
- **`content`**: Centered content container

## Usage Examples

### Two-Column Layout (Dashboard)

```vue
<template>
  <HeroJumbotron
    minHeight="md"
    gradientFrom="from-[#4b6cb7]"
    gradientTo="to-[#182848]"
  >
    <template #background>
      <StarryBackground :star-count="150" color="#7c9fe8" speed="slow" />
    </template>

    <template #left>
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
        Welcome back, <span class="gradient-text">{{ user?.display_name }}</span>!
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
        <BaseChip
          v-for="chip in chips"
          :key="chip.key"
          :variant="chip.variant"
          :label="chip.label"
        />
      </div>
    </template>
  </HeroJumbotron>
</template>
```

### Centered Layout (Homepage)

```vue
<template>
  <HeroJumbotron
    minHeight="md"
    gradientFrom="from-[#4b6cb7]"
    gradientTo="to-[#182848]"
    :centered="true"
  >
    <template #background>
      <StarryBackground :star-count="150" color="#7c9fe8" speed="slow" />
      <StarryBackground :star-count="100" color="#a8c0ff" speed="normal" />
    </template>

    <template #content>
      <div class="text-center max-w-4xl">
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          A Sky Full of <span class="gradient-text">gifts</span>
        </h1>
        <p class="text-xl md:text-2xl text-white/90 mb-10">
          Your subtitle here
        </p>
        <div class="flex gap-4 justify-center">
          <BaseButton variant="primary" size="lg">Get Started</BaseButton>
          <BaseButton variant="outline" size="lg">Learn More</BaseButton>
        </div>
      </div>
    </template>
  </HeroJumbotron>
</template>
```

### Full-Width Breakout (in Constrained Container)

When using HeroJumbotron inside a container with padding (e.g., BaseLayout), you can make it break out to full-width:

```vue
<template>
  <div class="full-bleed -mt-8">
    <HeroJumbotron minHeight="md">
      <!-- content -->
    </HeroJumbotron>
  </div>
</template>

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
```

## Styling Notes

- The component uses a `bg-gradient-to-br` (bottom-right) gradient direction
- Content is constrained to `max-w-7xl` and centered with `mx-auto`
- Horizontal padding matches the application layout: `px-4 sm:px-6 lg:px-8`
- Two-column layout uses a responsive grid that collapses to single column on mobile
- Centered layout uses flexbox for perfect vertical and horizontal centering

## Custom Gradient Colors

You can use any Tailwind color classes or custom colors with bracket notation:

```vue
<!-- Using Tailwind colors -->
<HeroJumbotron
  gradientFrom="from-indigo-600"
  gradientTo="to-purple-700"
/>

<!-- Using custom hex colors -->
<HeroJumbotron
  gradientFrom="from-[#4b6cb7]"
  gradientTo="to-[#182848]"
/>
```

## Accessibility

- Uses semantic `<section>` element
- Maintains proper heading hierarchy
- Supports responsive text sizing
- Ensures sufficient color contrast for text on gradient backgrounds

## Related Components

- **ChipsJumbotron** - Dashboard implementation with quick action chips
- **HomeJumbotron** - Homepage implementation with call-to-action buttons
- **StarryBackground** - Animated background decoration
