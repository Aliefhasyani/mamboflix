<template>
  <nav :class="['fixed top-0 w-full z-50 transition-colors duration-300 px-8 py-4 flex items-center justify-between',
                isScrolled ? 'bg-black' : 'bg-transparent text-shadow-md']">
    <div class="flex items-center gap-8">
      <h1 @click="navigateTo('home')" class="text-red-600 text-3xl font-bold tracking-tighter uppercase cursor-pointer">MAMBOFLIX</h1>
      <ul class="hidden md:flex gap-4 text-sm font-medium text-gray-200">
        <li @click="navigateTo('home')" class="hover:text-white cursor-pointer transition">Home</li>

        <li
          @click="navigateTo('watchlist')"
          class="relative hover:text-white cursor-pointer transition flex items-center gap-1.5"
        >
          My List
          <span
            v-if="watchlistCount > 0"
            class="absolute -top-2 -right-4 bg-red-600 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center leading-none"
          >{{ watchlistCount > 99 ? '99+' : watchlistCount }}</span>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-5 text-white">
      <div class="flex items-center gap-2">
        <button @click="toggleSearch" class="focus:outline-none" aria-label="Search">
          <svg v-if="!searchOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="2" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-300 transition">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="2" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-300 transition">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="w-0 opacity-0"
          enter-to-class="w-52 opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="w-52 opacity-100"
          leave-to-class="w-0 opacity-0"
        >
          <input
            v-if="searchOpen"
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Titles, people, genres..."
            class="bg-black/70 border border-white/30 text-white text-sm placeholder-gray-400
                   px-3 py-1.5 rounded focus:outline-none focus:border-white/70 w-52"
            @keydown.escape="closeSearch"
          />
        </transition>
      </div>

      <button
        @click="navigateTo('watchlist')"
        class="relative focus:outline-none group/wl"
        aria-label="My Watchlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
             class="w-5 h-5 transition-colors duration-200 group-hover/wl:text-red-400"
             :class="watchlistCount > 0 ? 'text-red-500' : 'text-gray-300'">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
        <span
          v-if="watchlistCount > 0"
          class="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center leading-none"
        >{{ watchlistCount > 99 ? '99+' : watchlistCount }}</span>
      </button>

      <i class="fas fa-bell cursor-pointer"></i>
      <div class="w-8 h-8 bg-blue-500 rounded"></div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useWatchlist } from '@/composables/useWatchlist';

const isScrolled = ref(false);
const searchOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['search', 'navigate']);

const { watchlistCount } = useWatchlist();

const navigateTo = (page: string) => {
  emit('navigate', page);
};

const handleScroll = () => { isScrolled.value = window.scrollY > 50; };

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    closeSearch();
  }
};

const closeSearch = () => {
  searchOpen.value = false;
  searchQuery.value = '';
  emit('search', '');
};

watch(searchQuery, (val) => emit('search', val));

import { onMounted, onUnmounted } from 'vue';
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>