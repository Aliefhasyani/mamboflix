<script setup lang="ts">
    defineProps<{
    title: string;
    items: any[]; 
    isLarge?: boolean;
    }>();
</script>

<template>
  <div class="space-y-2 px-4 md:px-12 group">
    <h2 class="font-display text-xl md:text-2xl tracking-wider text-gray-200 group-hover:text-white transition duration-300">
      {{ title }}
    </h2>

    <div class="flex overflow-x-scroll overflow-y-hidden scrollbar-hide space-x-3 p-2 -m-2">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        :class="[
          'relative flex-none transition-transform duration-300 ease-out cursor-pointer hover:scale-105 hover:z-30',
          isLarge ? 'w-44 md:w-64 h-64 md:h-96' : 'w-32 md:w-52 h-48 md:h-28'
        ]"
      >
        <img 
          :src="`https://picsum.photos/seed/${index + title}/500/300`" 
          alt="Movie Poster"
          class="w-full h-full object-cover rounded-sm shadow-md"
        />
        
        <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
          <p class="text-[10px] md:text-xs font-bold truncate">Movie Title {{ index + 1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>