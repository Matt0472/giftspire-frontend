<template>
  <section class="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
    </div>

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Main Title with Gradient -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          <span class="gradient-title">
            {{ $t('about.title') }}
          </span>
        </h2>

        <!-- Decorative Line -->
        <div class="flex items-center justify-center gap-4 mb-8">
          <div class="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-blue-500 rounded-full"></div>
          <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div class="h-1 w-20 bg-gradient-to-l from-transparent via-blue-500 to-blue-500 rounded-full"></div>
        </div>
      </div>

      <!-- Introduction Paragraph with Enhanced Styling -->
      <div class="max-w-4xl mx-auto mb-16">
        <p class="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed text-center">
          {{ $t('about.introduction') }}
        </p>
      </div>

      <!-- Content Sections with Enhanced Cards -->
      <div class="grid md:grid-cols-2 gap-8 lg:gap-10">
        <!-- Section 1: Think About the Special Person -->
        <div class="group card-enhanced bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 dark:from-blue-600 dark:via-indigo-700 dark:to-purple-700 rounded-3xl p-1 shadow-2xl">
          <div class="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden">
            <!-- Decorative Icon Background -->
            <div class="absolute top-0 right-0 text-9xl opacity-10 dark:opacity-15 transform translate-x-8 -translate-y-4">
              ✨
            </div>

            <div class="relative z-10">
              <!-- Icon -->
              <div class="w-16 h-16 mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span class="text-3xl">🎯</span>
              </div>

              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {{ $t('about.sections.thinkAboutPerson.title') }}
              </h3>

              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ $t('about.sections.thinkAboutPerson.description') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2: Perfect Gift for Every Occasion -->
        <div class="group card-enhanced bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 dark:from-purple-600 dark:via-pink-700 dark:to-rose-700 rounded-3xl p-1 shadow-2xl">
          <div class="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden">
            <!-- Decorative Icon Background -->
            <div class="absolute top-0 right-0 text-9xl opacity-10 dark:opacity-15 transform translate-x-8 -translate-y-4">
              🎁
            </div>

            <div class="relative z-10">
              <!-- Icon -->
              <div class="w-16 h-16 mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span class="text-3xl">🎉</span>
              </div>

              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {{ $t('about.sections.perfectGift.title') }}
              </h3>

              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ $t('about.sections.perfectGift.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic needed for this component
</script>

<style scoped>
/* Gradient title with animation */
.gradient-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: gradient-flow 8s ease infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Enhanced card with hover effects */
.card-enhanced {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.card-enhanced::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 1.5rem;
  padding: 2px;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-enhanced:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.card-enhanced:hover::before {
  opacity: 1;
}

/* Slow pulse animation for background decorations */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
