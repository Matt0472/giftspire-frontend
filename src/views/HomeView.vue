<template>
  <div>
    <!-- Hero/Jumbotron Section -->
    <HomeJumbotron />

    <!-- How It Works Section -->
    <HowItWorks />

    <!-- User Journey Carousel Section -->
    <UserJourneyCarousel />

    <!-- About GiftSpire Section -->
    <AboutGiftSpire />
  </div>
</template>

<script setup lang="ts">
import HomeJumbotron from '@/components/HomePage/HomeJumbotron.vue'
import HowItWorks from '@/components/HomePage/HowItWorks.vue'
import UserJourneyCarousel from '@/components/HomePage/UserJourneyCarousel.vue'
import AboutGiftSpire from '@/components/HomePage/AboutGiftSpire.vue'
</script>

