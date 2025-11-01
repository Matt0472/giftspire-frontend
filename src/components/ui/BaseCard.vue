<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href || undefined"
    :target="target"
    :rel="href ? computedRel : undefined"
    class="card-wrapper group relative block cursor-pointer"
  >
    <!-- Gradient border effect -->
    <div class="card-border"></div>

    <!-- Main card -->
    <div class="card-content">
      <!-- Image container with gradient overlay -->
      <div class="image-container">
        <div class="image-bg"></div>
        <img
          v-if="imageSrc"
          :src="imageSrc"
          :alt="imageAlt || title"
          class="image-element"
          loading="lazy"
        />
        <slot name="image" v-else />
        <div class="image-gradient"></div>
        <div class="image-shine"></div>
      </div>

      <!-- Content area with glassmorphism -->
      <div class="content-wrapper">
        <!-- Decorative gradient orb -->
        <div class="gradient-orb"></div>

        <h3 class="card-title">
          <slot name="title">{{ title }}</slot>
        </h3>

        <p class="card-description">
          <slot name="description">{{ description }}</slot>
        </p>

        <div v-if="href" class="card-link">
          <span class="link-text">Learn more</span>
          <svg class="link-arrow" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <div class="link-underline"></div>
        </div>
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
/* Card Wrapper - Main Container */
.card-wrapper {
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.card-wrapper:hover {
  transform: translateY(-8px) scale(1.01);
}

/* Animated Gradient Border */
.card-border {
  position: absolute;
  inset: -2px;
  border-radius: 28px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.3) 0%,
    rgba(168, 85, 247, 0.3) 25%,
    rgba(236, 72, 153, 0.3) 50%,
    rgba(251, 146, 60, 0.3) 75%,
    rgba(99, 102, 241, 0.3) 100%
  );
  background-size: 200% 200%;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: -1;
}

.group:hover .card-border {
  opacity: 1;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Main Card Content */
.card-content {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(249, 250, 251, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 8px 16px -4px rgba(0, 0, 0, 0.05),
    0 20px 40px -8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.group:hover .card-content {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.03),
    0 16px 32px -8px rgba(0, 0, 0, 0.1),
    0 32px 64px -12px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Dark mode card */
@media (prefers-color-scheme: dark) {
  .card-content {
    background: linear-gradient(
      to bottom right,
      rgba(55, 65, 81, 0.98) 0%,
      rgba(45, 55, 72, 0.98) 100%
    );
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.3),
      0 8px 16px -4px rgba(0, 0, 0, 0.4),
      0 20px 40px -8px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .group:hover .card-content {
    background: linear-gradient(
      to bottom right,
      rgba(65, 75, 91, 0.98) 0%,
      rgba(55, 65, 82, 0.98) 100%
    );
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.4),
      0 16px 32px -8px rgba(0, 0, 0, 0.5),
      0 32px 64px -12px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }
}

/* Image Container */
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.image-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(168, 85, 247, 0.1) 100%
  );
}

.image-element {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1;
}

.group:hover .image-element {
  transform: scale(1.08) rotate(0.5deg);
  filter: brightness(1.05) contrast(1.05);
}

/* Gradient overlay on image */
.image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 2;
}

.group:hover .image-gradient {
  opacity: 1;
}

/* Shimmer effect on image */
.image-shine {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 60%,
    transparent 100%
  );
  opacity: 0;
  transform: rotate(45deg);
  z-index: 3;
  pointer-events: none;
}

.group:hover .image-shine {
  animation: shine 1.5s ease-in-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
    opacity: 0;
  }
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  padding: 1.75rem;
  z-index: 1;
}

/* Decorative gradient orb */
.gradient-orb {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(168, 85, 247, 0.1) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
  filter: blur(40px);
}

.group:hover .gradient-orb {
  opacity: 1;
  transform: scale(1.2);
}

/* Title */
.card-title {
  position: relative;
  margin-bottom: 0.875rem;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: #111827;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-transform: capitalize;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.group:hover .card-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: translateX(2px);
}

@media (prefers-color-scheme: dark) {
  .card-title {
    color: #f9fafb;
  }
}

/* Description */
.card-description {
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .card-description {
    color: #d1d5db;
  }
}

/* Link */
.card-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #667eea;
  transition: gap 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.group:hover .card-link {
  gap: 0.75rem;
}

.link-text {
  position: relative;
  z-index: 1;
}

.link-arrow {
  width: 1.125rem;
  height: 1.125rem;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.group:hover .link-arrow {
  transform: translateX(4px);
}

/* Animated underline */
.link-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.group:hover .link-underline {
  width: calc(100% - 1.75rem);
}

/* Focus styles */
.card-wrapper:focus-visible {
  outline: none;
}

.card-wrapper:focus-visible .card-content {
  box-shadow:
    0 0 0 3px rgba(99, 102, 241, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.03),
    0 16px 32px -8px rgba(0, 0, 0, 0.1);
}
</style>
