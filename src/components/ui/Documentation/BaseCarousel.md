# BaseCarousel Component

A fully-featured, generic carousel component with auto-play, endless scrolling, and support for images, icons, or custom content.

## Features

- ✅ **Dual rendering modes**: Data-driven (slides array) or slot-based (custom content)
- ✅ **Endless scrolling**: Wraps from last to first slide and vice versa
- ✅ **Auto-play with smart timing**: Extends pause duration when user interacts
- ✅ **Flexible content**: Support for images, icons, or plain text
- ✅ **Customizable gradients**: Per-slide gradient backgrounds
- ✅ **Navigation controls**: Arrows and dot indicators (optional)
- ✅ **Accessibility**: ARIA labels and keyboard navigation support
- ✅ **Dark mode compatible**
- ✅ **Smooth transitions** with CSS transforms
- ✅ **Event emissions** for tracking slide changes
- ✅ **Exposed API** for programmatic control

## CarouselSlide Interface

```typescript
interface CarouselSlide {
  title: string              // Slide title (required)
  description: string        // Slide description (required)
  stepLabel?: string         // Optional label (e.g., "Step 1")
  image?: string             // Image URL (takes priority over icon)
  icon?: Component           // Vue component icon (shown if no image)
  gradient?: string          // Tailwind gradient classes
  backgroundImage?: string   // Background image URL
}
```

## Usage Modes

### Mode 1: Data-Driven (Slides Array)

Pass an array of slide objects for automatic rendering.

```vue
<template>
  <BaseCarousel :slides="carouselSlides" :auto-play="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserPlus, ClipboardList, Sparkles } from 'lucide-vue-next'
import BaseCarousel, { type CarouselSlide } from '@/components/ui/BaseCarousel.vue'

const carouselSlides = computed<CarouselSlide[]>(() => [
  {
    title: 'Create Account',
    description: 'Sign up in seconds and join our community.',
    stepLabel: 'Step 1',
    icon: UserPlus,
    gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
  },
  {
    title: 'Fill Form',
    description: 'Answer a few quick questions.',
    stepLabel: 'Step 2',
    icon: ClipboardList,
    gradient: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500'
  },
  {
    title: 'Get Results',
    description: 'Receive personalized recommendations instantly!',
    stepLabel: 'Step 3',
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500'
  }
])
</script>
```

### Mode 2: Slot-Based (Custom Content)

Use slots for complete control over slide rendering.

```vue
<template>
  <BaseCarousel :total-slides="3" :auto-play="true">
    <div class="w-full flex-shrink-0 min-h-[400px]">
      <div class="bg-blue-500 p-12 h-full">
        <h2>Custom Slide 1</h2>
      </div>
    </div>

    <div class="w-full flex-shrink-0 min-h-[400px]">
      <div class="bg-green-500 p-12 h-full">
        <h2>Custom Slide 2</h2>
      </div>
    </div>

    <div class="w-full flex-shrink-0 min-h-[400px]">
      <div class="bg-purple-500 p-12 h-full">
        <h2>Custom Slide 3</h2>
      </div>
    </div>
  </BaseCarousel>
</template>
```

## With Images

Use the `image` property to display images instead of icons:

```vue
<script setup lang="ts">
const carouselSlides: CarouselSlide[] = [
  {
    title: 'Welcome',
    description: 'Get started with our platform',
    image: '/images/welcome.png',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-500'
  },
  {
    title: 'Features',
    description: 'Explore our amazing features',
    image: '/images/features.png',
    gradient: 'bg-gradient-to-br from-green-500 to-teal-500'
  }
]
</script>

<template>
  <BaseCarousel :slides="carouselSlides" />
</template>
```

## With Background Images

Use `backgroundImage` for full-slide background images:

```vue
<script setup lang="ts">
const carouselSlides: CarouselSlide[] = [
  {
    title: 'Mountain View',
    description: 'Beautiful landscapes',
    backgroundImage: '/images/mountain.jpg'
  },
  {
    title: 'Ocean Breeze',
    description: 'Peaceful beaches',
    backgroundImage: '/images/ocean.jpg'
  }
]
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | `CarouselSlide[]` | `undefined` | Array of slide data objects |
| `totalSlides` | `number` | `undefined` | Number of slides (when using slots) |
| `autoPlay` | `boolean` | `true` | Enable automatic slide transitions |
| `autoPlayDelay` | `number` | `5000` | Normal auto-play interval (ms) |
| `extendedDelay` | `number` | `10000` | Extended delay after user interaction (ms) |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `previousLabel` | `string` | `'Previous slide'` | Accessibility label for previous button |
| `nextLabel` | `string` | `'Next slide'` | Accessibility label for next button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `slideChange` | `number` | Emitted when slide changes (provides new slide index) |

## Exposed Methods

Access these methods via template ref:

```vue
<template>
  <BaseCarousel ref="carouselRef" :slides="slides" />
  <button @click="carouselRef?.nextSlide()">Next</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const carouselRef = ref()
</script>
```

### Available Methods

- `nextSlide()` - Go to next slide
- `previousSlide()` - Go to previous slide
- `goToSlide(index: number)` - Jump to specific slide
- `getCurrentSlide()` - Get current slide index

## Advanced Examples

### Tracking Slide Changes

```vue
<template>
  <BaseCarousel :slides="slides" @slide-change="handleSlideChange" />
</template>

<script setup lang="ts">
const handleSlideChange = (index: number) => {
  console.log(`Now viewing slide ${index + 1}`)
  // Track analytics, update UI, etc.
}
</script>
```

### Controlling Carousel Programmatically

```vue
<template>
  <div>
    <BaseCarousel ref="carousel" :slides="slides" :auto-play="false" />

    <div class="mt-4 flex gap-2">
      <button @click="carousel?.previousSlide()">← Previous</button>
      <button @click="carousel?.nextSlide()">Next →</button>
      <button @click="carousel?.goToSlide(0)">Go to First</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const carousel = ref()
</script>
```

### Without Auto-Play

```vue
<template>
  <BaseCarousel :slides="slides" :auto-play="false" />
</template>
```

### Custom Timing

```vue
<template>
  <BaseCarousel
    :slides="slides"
    :auto-play-delay="3000"
    :extended-delay="15000"
  />
</template>
```

### Hide Navigation

```vue
<template>
  <BaseCarousel
    :slides="slides"
    :show-arrows="false"
    :show-dots="false"
  />
</template>
```

## Content Priority

When rendering slides from data, content is prioritized as follows:

1. **Image** - If `image` is provided, displays as img element
2. **Icon** - If `icon` is provided and no image, displays icon with animation
3. **Text only** - If neither image nor icon provided, only text is shown

## Styling

### Gradient Classes

Use Tailwind gradient utilities:

```typescript
gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600'
gradient: 'bg-gradient-to-tl from-pink-500 to-rose-500'
```

### Icon Animation

Icons automatically float with a smooth animation. The animation is defined in the component's scoped styles.

### Minimum Height

All slides have a minimum height of 400px to prevent layout shifts during transitions.

## Accessibility

- Navigation arrows include ARIA labels
- Dot indicators include screen reader text
- Supports keyboard navigation
- Smooth transitions for better UX
- Focus management for interactive elements

## Best Practices

1. **Consistent slide count**: Ensure all slides have similar content length
2. **Readable text**: Use high contrast text against backgrounds
3. **Optimize images**: Compress images for faster loading
4. **Limit slide count**: 3-7 slides work best for user engagement
5. **Test auto-play timing**: Ensure users have enough time to read content

## Real-World Example

```vue
<template>
  <section class="py-20">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-16">
        How It Works
      </h2>

      <BaseCarousel
        :slides="steps"
        :auto-play="true"
        @slide-change="trackAnalytics"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserPlus, FileText, CheckCircle } from 'lucide-vue-next'
import BaseCarousel, { type CarouselSlide } from '@/components/ui/BaseCarousel.vue'

const steps = computed<CarouselSlide[]>(() => [
  {
    title: 'Sign Up',
    description: 'Create your free account in 30 seconds',
    stepLabel: 'Step 1',
    icon: UserPlus,
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    title: 'Complete Profile',
    description: 'Tell us about your preferences',
    stepLabel: 'Step 2',
    icon: FileText,
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  {
    title: 'Get Started',
    description: 'Start enjoying all features immediately',
    stepLabel: 'Step 3',
    icon: CheckCircle,
    gradient: 'bg-gradient-to-br from-green-500 to-teal-600'
  }
])

const trackAnalytics = (index: number) => {
  // Send analytics event
  console.log(`User viewed slide: ${index}`)
}
</script>
```
