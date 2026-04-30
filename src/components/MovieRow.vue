<script setup lang="ts">
import { ref } from 'vue';
import { useWatchlist } from '@/composables/useWatchlist';

const props = defineProps<{
  title: string;
  items: any[];
  isLarge?: boolean;
  itemType?: 'movie' | 'tv';
}>();

const { isInWatchlist, toggleWatchlist } = useWatchlist();

const rowRef = ref<HTMLElement | null>(null);

const toastMap = ref<Record<number, 'added' | 'removed' | null>>({});

const scroll = (direction: 'left' | 'right') => {
  const el = rowRef.value;
  if (!el) return;
  const amount = el.clientWidth * 0.75;
  el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
};

const handleToggle = (item: any) => {
  const wasIn = isInWatchlist(item.id);
  toggleWatchlist({
    id: item.id,
    title: item.title,
    poster: item.poster,
    vote_average: item.vote_average,
    vote_count: item.vote_count,
    type: props.itemType ?? 'movie',
  });
  toastMap.value[item.id] = wasIn ? 'removed' : 'added';
  setTimeout(() => {
    toastMap.value[item.id] = null;
  }, 1800);
};
</script>

<template>
  <div class="space-y-2 px-4 md:px-12 group">
    <h2 class="font-display text-xl md:text-2xl tracking-wider text-gray-200 group-hover:text-white transition duration-300">
      {{ title }}
    </h2>

    <div class="relative">

      <button
        @click="scroll('left')"
        aria-label="Scroll left"
        class="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-20
               flex items-center justify-center
               w-10 h-10 rounded-full
               bg-black/80 text-white border border-white/15
               backdrop-blur-sm cursor-pointer
               opacity-0 group-hover:opacity-100 focus:opacity-100
               transition-all duration-200
               hover:bg-red-600/85 hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.75.75 0 1 1-1.06 1.06l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
      </button>

      <div
        ref="rowRef"
        class="flex overflow-x-scroll overflow-y-hidden scrollbar-hide space-x-3 p-2 -m-2"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="[
            'relative flex-none transition-transform duration-300 ease-out cursor-pointer hover:scale-105 hover:z-30',
            isLarge ? 'w-44 md:w-64 h-64 md:h-96' : 'w-32 md:w-52 h-48 md:h-28'
          ]"
        >
          <img
            :src="item.poster"
            class="w-full h-full object-cover rounded-sm shadow-md"
          />

          <span
            v-if="item.vote_average > 8 && item.vote_count > 1000"
            class="absolute top-1.5 left-1.5 z-10
                   flex items-center gap-0.5
                   bg-yellow-400 text-black text-[9px] md:text-[10px]
                   font-bold px-1.5 py-0.5 rounded-sm
                   shadow-md tracking-wide uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5 shrink-0">
              <path fill-rule="evenodd" d="M8 1.25a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.398.853 3.584a.75.75 0 0 1-1.12.814L8 11.345l-3.136 1.966a.75.75 0 0 1-1.12-.814l.853-3.584-2.79-2.398a.75.75 0 0 1 .427-1.317l3.664-.293L7.308 1.712A.75.75 0 0 1 8 1.25Z" clip-rule="evenodd" />
            </svg>
            Recommended
          </span>

          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2 rounded-sm">
            <div></div>
            <div class="space-y-1.5">
              <p class="text-[10px] md:text-xs font-bold truncate leading-tight">{{ item.title }}</p>
              <button
                @click.stop="handleToggle(item)"
                :class="[
                  'flex items-center gap-1 text-[9px] md:text-[10px] font-semibold px-2 py-1 rounded-full transition-all duration-200 w-full justify-center',
                  isInWatchlist(item.id)
                    ? 'bg-white text-black hover:bg-red-500 hover:text-white'
                    : 'bg-white/20 text-white border border-white/40 hover:bg-white hover:text-black backdrop-blur-sm'
                ]"
                :aria-label="isInWatchlist(item.id) ? 'Remove from watchlist' : 'Add to watchlist'"
              >
                <svg v-if="isInWatchlist(item.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 shrink-0">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 shrink-0">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                {{ isInWatchlist(item.id) ? 'In My List' : 'My List' }}
              </button>
            </div>
          </div>

          <transition name="toast-pop">
            <div
              v-if="toastMap[item.id]"
              class="absolute inset-x-0 top-2 mx-2 z-40 flex items-center justify-center"
            >
              <span :class="[
                'text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg',
                toastMap[item.id] === 'added' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200'
              ]">
                {{ toastMap[item.id] === 'added' ? '✓ Added to My List' : '✕ Removed' }}
              </span>
            </div>
          </transition>
        </div>
      </div>

      <button
        @click="scroll('right')"
        aria-label="Scroll right"
        class="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-20
               flex items-center justify-center
               w-10 h-10 rounded-full
               bg-black/80 text-white border border-white/15
               backdrop-blur-sm cursor-pointer
               opacity-0 group-hover:opacity-100 focus:opacity-100
               transition-all duration-200
               hover:bg-red-600/85 hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12 8.72 6.28a.75.75 0 0 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.toast-pop-enter-active { animation: toast-in 0.25s ease-out; }
.toast-pop-leave-active { animation: toast-in 0.2s ease-in reverse; }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(-6px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>