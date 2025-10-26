<template>
  <section class="py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('howItWorks.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {{ $t('howItWorks.subtitle') }}
        </p>
      </div>

      <!-- Timeline Container -->
      <div class="relative">
        <!-- Vertical line for desktop -->
        <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>

        <!-- Steps -->
        <div class="space-y-12 md:space-y-16">
          <!-- Step 1: Gender -->
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between md:flex-row-reverse gap-4 mb-4">
                  <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <User class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ $t('howItWorks.step') }} 1</span>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('howItWorks.steps.gender.title') }}</h3>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ $t('howItWorks.steps.gender.description') }}
                </p>
              </div>
            </div>
            <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-indigo-500 rounded-full z-10 hidden md:block order-1 md:order-2"></div>
            <div class="md:w-1/2 md:pl-12 order-1 md:order-3"></div>
          </div>

          <!-- Step 2: Relation -->
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="md:w-1/2 md:pr-12 order-2 md:order-1"></div>
            <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-purple-500 rounded-full z-10 hidden md:block order-1 md:order-2"></div>
            <div class="md:w-1/2 md:pl-12 order-2 md:order-3">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between gap-4 mb-4">
                  <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ $t('howItWorks.step') }} 2</span>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('howItWorks.steps.relation.title') }}</h3>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ $t('howItWorks.steps.relation.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 3: Occasion -->
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between md:flex-row-reverse gap-4 mb-4">
                  <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ $t('howItWorks.step') }} 3</span>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('howItWorks.steps.occasion.title') }}</h3>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ $t('howItWorks.steps.occasion.description') }}
                </p>
              </div>
            </div>
            <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-purple-500 rounded-full z-10 hidden md:block order-1 md:order-2"></div>
            <div class="md:w-1/2 md:pl-12 order-1 md:order-3"></div>
          </div>

          <!-- Step 4: Interest -->
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="md:w-1/2 md:pr-12 order-2 md:order-1"></div>
            <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full z-10 hidden md:block order-1 md:order-2"></div>
            <div class="md:w-1/2 md:pl-12 order-2 md:order-3">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between gap-4 mb-4">
                  <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ $t('howItWorks.step') }} 4</span>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('howItWorks.steps.interest.title') }}</h3>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ $t('howItWorks.steps.interest.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 5: Budget -->
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between md:flex-row-reverse gap-4 mb-4">
                  <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1">
                    <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ $t('howItWorks.step') }} 5</span>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('howItWorks.steps.budget.title') }}</h3>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ $t('howItWorks.steps.budget.description') }}
                </p>
              </div>
            </div>
            <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-pink-500 rounded-full z-10 hidden md:block order-1 md:order-2"></div>
            <div class="md:w-1/2 md:pl-12 order-1 md:order-3"></div>
          </div>

          <!-- Final Result Step -->
          <div class="relative pt-8">
            <!-- Connector dot -->
            <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-4 border-pink-500 rounded-full z-10 hidden md:block -top-4"></div>

            <!-- Result Card (Full Width) -->
            <div class="mt-12 max-w-4xl mx-auto">
              <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-1 shadow-2xl">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-10">
                  <div class="text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                      <Sparkles class="w-10 h-10 text-white" />
                    </div>
                    <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {{ $t('howItWorks.result.title') }}
                    </h3>
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      {{ $t('howItWorks.result.description') }}
                    </p>

                    <!-- Feature highlights -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div class="flex flex-col items-center">
                        <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-3">
                          <Gift class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5+</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('howItWorks.result.suggestions') }}</span>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3">
                          <Zap class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ $t('howItWorks.result.instant') }}</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('howItWorks.result.speed') }}</span>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-3">
                          <Target class="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span class="text-2xl font-bold text-pink-600 dark:text-pink-400">100%</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('howItWorks.result.personalized') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center mt-16">
        <router-link
          to="/register"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {{ $t('howItWorks.cta') }}
          <ArrowRight class="w-5 h-5" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { User, Users, Calendar, Heart, DollarSign, Sparkles, Gift, Zap, Target, ArrowRight } from 'lucide-vue-next'
</script>

<style scoped>
/* Add subtle animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hover\:shadow-2xl:hover {
  animation: float 3s ease-in-out infinite;
}
</style>
