# StarryBackground Component

An animated starry background effect with rising stars at different speeds, perfect for hero sections and landing pages.

## Features

- ✅ Customizable star count
- ✅ Adjustable color
- ✅ Three speed presets (slow, normal, fast)
- ✅ Configurable star sizes
- ✅ Smooth animations
- ✅ Gradient mask for fade effect
- ✅ Radial gradient overlay
- ✅ Performance optimized with CSS animations
- ✅ Layered star movement
- ✅ Zero pointer events (doesn't block interactions)

## Basic Usage

```vue
<template>
  <div class="relative min-h-screen">
    <StarryBackground />

    <!-- Your content here -->
    <div class="relative z-10">
      <h1>Welcome</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarryBackground from '@/components/ui/StarryBackground.vue'
</script>
```

## Custom Configuration

```vue
<template>
  <div class="relative min-h-screen">
    <!-- More stars, pink color, faster speed -->
    <StarryBackground
      :star-count="500"
      color="#e879f9"
      speed="fast"
      :size="{ min: 1, max: 3 }"
    />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `starCount` | `number` | `300` | Total number of stars to generate |
| `color` | `string` | `'#8b5cf6'` | Color of the stars (any valid CSS color) |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed preset |
| `size` | `{ min: number, max: number }` | `{ min: 1, max: 2 }` | Star size range in pixels |

## Speed Presets

The component uses three speed layers with different configurations:

| Speed | Duration | Opacity | Star Ratio |
|-------|----------|---------|------------|
| `slow` | 200s | 0.5 | 30% of stars |
| `normal` | 150s | 0.75 | 30% of stars |
| `fast` | 100s | 1.0 | 40% of stars |

Each layer creates a parallax effect with stars moving at different speeds.

## Color Examples

```vue
<!-- Purple (default) -->
<StarryBackground color="#8b5cf6" />

<!-- Pink -->
<StarryBackground color="#e879f9" />

<!-- Blue -->
<StarryBackground color="#3b82f6" />

<!-- White -->
<StarryBackground color="#ffffff" />

<!-- Gold -->
<StarryBackground color="#fbbf24" />
```

## Size Configuration

```vue
<!-- Tiny stars -->
<StarryBackground :size="{ min: 0.5, max: 1 }" />

<!-- Small stars (default) -->
<StarryBackground :size="{ min: 1, max: 2 }" />

<!-- Medium stars -->
<StarryBackground :size="{ min: 2, max: 4 }" />

<!-- Large stars -->
<StarryBackground :size="{ min: 3, max: 6 }" />
```

## Star Count Variations

```vue
<!-- Sparse -->
<StarryBackground :star-count="100" />

<!-- Normal (default) -->
<StarryBackground :star-count="300" />

<!-- Dense -->
<StarryBackground :star-count="500" />

<!-- Very dense -->
<StarryBackground :star-count="1000" />
```

**Note**: Higher star counts may impact performance on lower-end devices.

## Examples

### Hero Section

```vue
<template>
  <div class="relative min-h-[600px] flex items-center justify-center overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-900"></div>

    <!-- Starry background -->
    <StarryBackground :star-count="200" color="#e879f9" />

    <!-- Content -->
    <div class="relative z-10 text-center text-white">
      <h1 class="text-6xl font-bold mb-4">Welcome</h1>
      <p class="text-xl">Beautiful animated backgrounds</p>
    </div>
  </div>
</template>
```

### Full Page Background

```vue
<template>
  <div class="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
    <StarryBackground
      :star-count="400"
      color="#ffffff"
      speed="slow"
    />

    <div class="relative z-10 p-8">
      <!-- Your page content -->
    </div>
  </div>
</template>
```

### With Dark Background

```vue
<template>
  <div class="relative min-h-screen bg-black">
    <!-- Slower, white stars for night sky effect -->
    <StarryBackground
      :star-count="300"
      color="#ffffff"
      speed="slow"
      :size="{ min: 1, max: 3 }"
    />

    <div class="relative z-10">
      <!-- Content -->
    </div>
  </div>
</template>
```

### Multiple Colors (Layered)

```vue
<template>
  <div class="relative min-h-screen">
    <!-- Purple stars -->
    <StarryBackground
      :star-count="150"
      color="#8b5cf6"
      speed="fast"
    />

    <!-- Pink stars on top -->
    <StarryBackground
      :star-count="150"
      color="#ec4899"
      speed="slow"
    />

    <div class="relative z-10">
      <!-- Content -->
    </div>
  </div>
</template>
```

## Technical Details

### Animation

Stars are animated using CSS keyframes that translate them vertically:

```css
@keyframes risingStarsAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2000px);
  }
}
```

### Star Layers

The component generates three layers of stars:
- **Fast layer**: 40% of total stars, opacity 1.0, 100s duration
- **Normal layer**: 30% of total stars, opacity 0.75, 150s duration
- **Slow layer**: 30% of total stars, opacity 0.5, 200s duration

### Gradient Mask

A vertical gradient mask creates a fade effect:
- Transparent at top (0%)
- Fades in at 25%
- Full opacity at center (50%)
- Fades out at 75%
- Transparent at bottom (100%)

### SVG Overlay

Includes a radial gradient SVG overlay for additional visual depth.

## Performance Considerations

1. **Star count**: Higher counts (>500) may impact performance on mobile devices
2. **CSS animations**: Uses `will-change: transform` for GPU acceleration
3. **Pointer events**: Disabled to prevent blocking user interactions
4. **Z-index**: Set to `-1` to stay behind content

## Best Practices

1. **Container positioning**: Use `relative` positioning on the parent container
2. **Content z-index**: Ensure content has `relative z-10` or higher
3. **Background color**: Pair with a solid background color for fallback
4. **Overflow hidden**: Add `overflow-hidden` to parent to prevent scroll
5. **Color coordination**: Match star color with your color scheme

## Styling Tips

### With Gradient Background

```vue
<div class="relative min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
  <StarryBackground color="#fbbf24" />
  <!-- Content -->
</div>
```

### With Image Background

```vue
<div class="relative min-h-screen bg-cover bg-center" style="background-image: url('/hero-bg.jpg')">
  <div class="absolute inset-0 bg-black/50"></div>
  <StarryBackground color="#ffffff" :star-count="200" />
  <!-- Content -->
</div>
```

### Dark Mode Support

```vue
<div class="relative min-h-screen bg-white dark:bg-gray-900">
  <StarryBackground
    :color="isDark ? '#ffffff' : '#8b5cf6'"
    :star-count="300"
  />
  <!-- Content -->
</div>
```

## Accessibility

- **Pointer events disabled**: Doesn't interfere with screen readers or keyboard navigation
- **Decorative only**: Stars are purely decorative, no semantic meaning
- **Performance**: Uses CSS animations for smooth 60fps performance

## Browser Support

- Modern browsers with CSS animations support
- CSS mask-image support (Safari with `-webkit-` prefix)
- Graceful degradation on older browsers (stars won't appear but content remains accessible)

## Integration Examples

### Landing Page

```vue
<template>
  <div class="landing-page">
    <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <StarryBackground
        :star-count="300"
        color="#e879f9"
        speed="normal"
      />

      <div class="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
        <h1 class="text-6xl font-bold mb-6">Welcome to GiftSpire</h1>
        <p class="text-2xl mb-8">Find the perfect gift, every time</p>
        <button class="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold">
          Get Started
        </button>
      </div>
    </div>
  </div>
</template>
```

### Section Background

```vue
<template>
  <section class="relative py-24 bg-gradient-to-b from-purple-900 to-black overflow-hidden">
    <StarryBackground
      :star-count="150"
      color="#8b5cf6"
      speed="slow"
    />

    <div class="relative z-10 container mx-auto px-4">
      <h2 class="text-4xl font-bold text-white mb-8">Features</h2>
      <!-- Feature cards -->
    </div>
  </section>
</template>
```
