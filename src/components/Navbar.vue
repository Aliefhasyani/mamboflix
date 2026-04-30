<template>
  <nav :class="['fixed top-0 w-full z-50 transition-colors duration-300 px-8 py-4 flex items-center justify-between',
                isScrolled ? 'bg-black' : 'bg-transparent text-shadow-md']">
    <div class="flex items-center gap-8">
      <h1 class="text-red-600 text-3xl font-bold tracking-tighter uppercase">MAMBOFLIX</h1>
      <ul class="hidden md:flex gap-4 text-sm font-medium text-gray-200">
        <li class="hover:text-white cursor-pointer transition">Home</li>
        <li class="hover:text-white cursor-pointer transition">TV Shows</li>
        <li class="hover:text-white cursor-pointer transition">Movies</li>
        <li class="hover:text-white cursor-pointer transition">New &amp; Popular</li>
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

      <i class="fas fa-bell cursor-pointer"></i>
      <div class="w-8 h-8 bg-blue-500 rounded"></div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const isScrolled = ref(false);
const searchOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);

const emit = defineEmits(['search']);

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