<script setup lang="ts">
import { computed } from 'vue';
import { useWatchlist } from '@/composables/useWatchlist';

const emit = defineEmits<{ (e: 'browse'): void }>();

const { watchlist, removeFromWatchlist } = useWatchlist();

const isEmpty = computed(() => watchlist.value.length === 0);
</script>

<template>
  <div v-if="isEmpty" class="flex flex-col items-center justify-center py-32 gap-6 text-center">
    <div class="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-10 h-10 text-gray-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    </div>
    <div>
      <p class="text-xl font-semibold text-gray-300">Your list is empty</p>
      <p class="text-gray-500 text-sm mt-2 max-w-xs">
        Browse movies and TV shows, then click <strong class="text-gray-300">My List</strong> to save them here.
      </p>
    </div>
    <button
      @click="emit('browse')"
      class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded transition-colors"
    >
      Browse Content
    </button>
  </div>

  <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <transition-group name="card-list" tag="div" class="contents">
      <div
        v-for="item in watchlist"
        :key="item.id"
        class="relative group/card rounded-md overflow-hidden shadow-lg bg-gray-900 cursor-pointer"
      >
        <div class="aspect-video w-full overflow-hidden">
          <img
            :src="item.poster"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
            loading="lazy"
          />
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-2">
          <p class="text-xs font-bold leading-snug line-clamp-2">{{ item.title }}</p>

          <div class="flex items-center gap-1.5">
            <span v-if="item.vote_average > 0" class="flex items-center gap-0.5 text-[10px] text-yellow-400 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5">
                <path fill-rule="evenodd" d="M8 1.25a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.398.853 3.584a.75.75 0 0 1-1.12.814L8 11.345l-3.136 1.966a.75.75 0 0 1-1.12-.814l.853-3.584-2.79-2.398a.75.75 0 0 1 .427-1.317l3.664-.293L7.308 1.712A.75.75 0 0 1 8 1.25Z" clip-rule="evenodd" />
              </svg>
              {{ item.vote_average.toFixed(1) }}
            </span>
            <span class="text-[10px] text-gray-400 uppercase font-medium">{{ item.type ?? 'movie' }}</span>
          </div>

          <button
            @click.stop="removeFromWatchlist(item.id)"
            class="flex items-center justify-center gap-1 text-[10px] font-semibold
                   bg-white/15 hover:bg-red-600 text-white border border-white/20
                   px-3 py-1 rounded-full transition-all duration-200 backdrop-blur-sm w-full"
            aria-label="Remove from watchlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 shrink-0">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
            Remove
          </button>
        </div>

        <div class="absolute top-2 right-2">
          <span
            class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm tracking-wide"
            :class="item.type === 'tv' ? 'bg-blue-600/80 text-white' : 'bg-red-600/80 text-white'"
          >
            {{ item.type === 'tv' ? 'TV' : 'Film' }}
          </span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}
.card-list-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(12px);
}
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(-8px);
}
.card-list-move {
  transition: transform 0.3s ease;
}
</style>
