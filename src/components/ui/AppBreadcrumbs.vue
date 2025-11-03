<script setup lang="ts">
import { ChevronRight, Home } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: { name: string; params?: Record<string, string> } | string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
const router = useRouter()

const navigate = (item: BreadcrumbItem) => {
  if (item.to) {
    if (typeof item.to === 'string') {
      router.push(item.to)
    } else {
      router.push(item.to)
    }
  }
}
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <button
          @click="navigate({ label: 'Home', to: '/' })"
          class="breadcrumb-link home-link"
          aria-label="Home"
        >
          <Home class="w-4 h-4" />
        </button>
      </li>

      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
      >
        <ChevronRight class="breadcrumb-separator" />

        <button
          v-if="item.to && index < items.length - 1"
          @click="navigate(item)"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </button>

        <span
          v-else
          class="breadcrumb-current"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  margin-bottom: 2rem;
  animation: fadeInDown 0.4s ease-out;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.08);
}

.home-link {
  padding: 0.5rem;
  color: #374151;
}

.breadcrumb-separator {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.breadcrumb-current {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e40af;
  background: #dbeafe;
  border-radius: 0.5rem;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .breadcrumb-link {
    color: #d1d5db;
  }

  .breadcrumb-link:hover {
    color: #a5b4fc;
    background: rgba(99, 102, 241, 0.2);
  }

  .breadcrumb-separator {
    color: #6b7280;
  }

  .breadcrumb-current {
    color: #a5b4fc;
    background: rgba(99, 102, 241, 0.2);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .breadcrumbs {
    margin-bottom: 1.5rem;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    font-size: 0.8125rem;
    padding: 0.25rem 0.5rem;
  }

  .home-link {
    padding: 0.375rem;
  }

  .breadcrumb-separator {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>
