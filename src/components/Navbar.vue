<template>
  <nav :class="['fixed top-0 w-full z-50 transition-colors duration-300 px-8 py-4 flex items-center justify-between', 
                isScrolled ? 'bg-black' : 'bg-transparent text-shadow-md']">
    <div class="flex items-center gap-8">
      <h1 class="text-red-600 text-3xl font-bold tracking-tighter uppercase">MAMBOFLIX</h1>
      <ul class="hidden md:flex gap-4 text-sm font-medium text-gray-200">
        <li class="hover:text-white cursor-pointer transition">Home</li>
        <li class="hover:text-white cursor-pointer transition">TV Shows</li>
        <li class="hover:text-white cursor-pointer transition">Movies</li>
        <li class="hover:text-white cursor-pointer transition">New & Popular</li>
      </ul>
    </div>
    <div class="flex items-center gap-5 text-white">
      <i class="fas fa-search cursor-pointer"></i>
      <i class="fas fa-bell cursor-pointer"></i>
      <div class="w-8 h-8 bg-blue-500 rounded"></div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script> 