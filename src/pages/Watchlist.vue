<script setup lang="ts">
import { useWatchlist } from '@/composables/useWatchlist';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import WatchlistGrid from '@/components/WatchlistGrid.vue';

const { watchlistCount } = useWatchlist();

const emit = defineEmits<{
  (e: 'navigate', page: string): void;
}>();
</script>

<template>
  <div class="bg-brand-dark min-h-screen text-white font-sans overflow-x-hidden">
    <Navbar @search="() => {}" @navigate="emit('navigate', $event)" />

    <main class="pt-28 pb-20 px-8 md:px-16">
      <div class="flex items-center gap-4 mb-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-red-500">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
        <div>
          <h1 class="font-display text-3xl md:text-4xl font-bold tracking-wide">My List</h1>
          <p class="text-gray-400 text-sm mt-0.5">
            {{ watchlistCount }} title{{ watchlistCount !== 1 ? 's' : '' }} saved
          </p>
        </div>
      </div>

      <WatchlistGrid @browse="emit('navigate', 'home')" />
    </main>

    <Footer></Footer>
  </div>
</template>
