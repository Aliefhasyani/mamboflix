<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { useMovieDetail } from '@/composables/useMovieDetail';
import { useWatchlist } from '@/composables/useWatchlist';

const props = defineProps<{
  itemId: number | null;
  itemType: 'movie' | 'tv';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'open-similar', id: number, type: 'movie' | 'tv'): void;
}>();

const { detail, loading, fetchDetail, clearDetail } = useMovieDetail();
const { isInWatchlist, toggleWatchlist } = useWatchlist();

watch(
  () => props.itemId,
  (id) => {
    if (id != null) {
      fetchDetail(id, props.itemType);
    } else {
      clearDetail();
    }
  },
  { immediate: true }
);

const close = () => emit('close');

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};
onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

const year = computed(() => {
  if (!detail.value) return '';
  const d = detail.value.release_date || detail.value.first_air_date;
  return d ? d.slice(0, 4) : '';
});

const ratingColor = computed(() => {
  const r = detail.value?.vote_average ?? 0;
  if (r >= 8) return '#22c55e';
  if (r >= 6.5) return '#eab308';
  return '#ef4444';
});

const ratingPercent = computed(() =>
  Math.round(((detail.value?.vote_average ?? 0) / 10) * 100)
);

const metaInfo = computed(() => {
  if (!detail.value) return [];
  const items: string[] = [];
  if (year.value) items.push(year.value);
  if (detail.value.runtime) {
    const h = Math.floor(detail.value.runtime / 60);
    const m = detail.value.runtime % 60;
    items.push(h > 0 ? `${h}h ${m}m` : `${m}m`);
  }
  if (detail.value.number_of_seasons != null) {
    items.push(
      `${detail.value.number_of_seasons} Season${detail.value.number_of_seasons > 1 ? 's' : ''}`
    );
  }
  if (detail.value.number_of_episodes != null) {
    items.push(`${detail.value.number_of_episodes} Episodes`);
  }
  return items;
});

const handleWatchlist = () => {
  if (!detail.value) return;
  toggleWatchlist({
    id: detail.value.id,
    title: detail.value.title,
    poster: detail.value.poster_path || detail.value.backdrop_path,
    vote_average: detail.value.vote_average,
    vote_count: detail.value.vote_count,
    type: detail.value.type,
  });
};

const openSimilar = (id: number) => emit('open-similar', id, props.itemType);

const langName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="itemId != null"
        class="fixed inset-0 z-[9000] flex items-center justify-center p-4 overflow-y-auto bg-black/85 backdrop-blur-md"
        @click.self="close"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          v-if="loading"
          class="flex flex-col items-center gap-4"
        >
          <div class="w-13 h-13 rounded-full border-3 border-white/10 border-t-[#e50914] animate-spin"></div>
          <p class="text-sm text-white/50">Loading details...</p>
        </div>

        <div
          v-else-if="detail"
          class="relative w-full max-w-[900px] max-h-[calc(100vh-2rem)] bg-[#141414] rounded-xl overflow-hidden overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.9)] border border-white/[0.07] scrollbar-thin scrollbar-thumb-white/15 scrollbar-track-transparent"
        >
          <button
            class="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#e50914] hover:scale-110 backdrop-blur-sm"
            @click="close"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>

          <div class="relative w-full min-h-[340px] bg-[#0a0a0a]">
            <img
              v-if="detail.backdrop_path"
              :src="detail.backdrop_path"
              :alt="detail.title"
              class="w-full h-[340px] object-cover block"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-[rgba(20,20,20,0.1)] via-[rgba(20,20,20,0.55)] to-[rgba(20,20,20,0.97)]"></div>

            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex gap-5 items-end">
                <img
                  v-if="detail.poster_path"
                  :src="detail.poster_path"
                  :alt="detail.title"
                  class="hidden sm:block w-[110px] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] border-2 border-white/10 shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex gap-2 mb-2 flex-wrap">
                    <span
                      class="text-[0.65rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                      :class="detail.type === 'tv' ? 'bg-[#0f4a8a] text-white' : 'bg-[#e50914] text-white'"
                    >
                      {{ detail.type === 'tv' ? 'TV Show' : 'Movie' }}
                    </span>
                    <span
                      v-if="detail.status"
                      class="text-[0.65rem] font-semibold px-2 py-0.5 rounded bg-white/10 text-white/75 border border-white/15"
                    >
                      {{ detail.status }}
                    </span>
                  </div>

                  <h2 id="modal-title" class="text-[clamp(1.4rem,4vw,2.2rem)] font-extrabold leading-[1.15] text-white mb-1 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
                    {{ detail.title }}
                  </h2>
                  <p v-if="detail.tagline" class="text-[0.8rem] text-white/55 italic mb-2.5">
                    "{{ detail.tagline }}"
                  </p>

                  <div class="flex items-center flex-wrap gap-1 text-[0.78rem] text-white/60 mb-3">
                    <template v-for="(m, i) in metaInfo" :key="i">
                      <span>{{ m }}</span>
                      <span v-if="i < metaInfo.length - 1" class="text-white/30">·</span>
                    </template>
                    <span
                      v-if="detail.original_language"
                      class="ml-1 bg-white/10 border border-white/15 rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white/70"
                    >
                      {{ langName(detail.original_language) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 mb-4">
                    <div class="relative w-12 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" class="w-12 h-12">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="3" />
                        <circle
                          cx="18" cy="18" r="15.9"
                          fill="none"
                          :stroke="ratingColor"
                          stroke-width="3"
                          stroke-linecap="round"
                          :stroke-dasharray="`${ratingPercent} 100`"
                          transform="rotate(-90 18 18)"
                          class="transition-[stroke-dasharray] duration-700 ease-in-out"
                        />
                      </svg>
                      <span class="absolute text-[0.7rem] font-extrabold" :style="{ color: ratingColor }">
                        {{ detail.vote_average.toFixed(1) }}
                      </span>
                    </div>
                    <span class="text-[0.72rem] text-white/45">
                      {{ detail.vote_count.toLocaleString() }} votes
                    </span>
                  </div>

                  <div class="flex gap-3 flex-wrap">
                    <a
                      v-if="detail.trailer"
                      :href="`https://www.youtube.com/watch?v=${detail.trailer.key}`"
                      target="_blank"
                      rel="noopener"
                      class="inline-flex items-center gap-2 bg-[#e50914] text-white px-5 py-2 rounded-md font-bold text-[0.85rem] no-underline transition-all duration-200 hover:bg-[#c40812] hover:scale-[1.04]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                      </svg>
                      Watch Trailer
                    </a>

                    <button
                      @click="handleWatchlist"
                      class="inline-flex items-center gap-2 px-5 py-2 rounded-md font-bold text-[0.85rem] cursor-pointer transition-all duration-200 hover:scale-[1.04] backdrop-blur-sm"
                      :class="isInWatchlist(detail.id)
                        ? 'bg-white/90 text-[#141414] border-transparent'
                        : 'bg-white/10 text-white border border-white/25 hover:bg-white/20'"
                    >
                      <svg v-if="isInWatchlist(detail.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                      </svg>
                      {{ isInWatchlist(detail.id) ? 'In My List' : 'Add to My List' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 flex flex-col gap-7">
            <div v-if="detail.genres.length" class="flex flex-wrap gap-2">
              <span
                v-for="g in detail.genres"
                :key="g.id"
                class="px-3 py-1 rounded-full bg-[rgba(229,9,20,0.15)] text-[#ff6b6b] border border-[rgba(229,9,20,0.3)] text-xs font-semibold transition-colors duration-200 hover:bg-[rgba(229,9,20,0.28)]"
              >
                {{ g.name }}
              </span>
            </div>

            <div v-if="detail.overview" class="flex flex-col gap-3">
              <h3 class="text-[0.95rem] font-bold text-white uppercase tracking-widest pb-1.5 border-b border-white/[0.08]">
                Synopsis
              </h3>
              <p class="text-[0.9rem] leading-7 text-white/75">{{ detail.overview }}</p>
            </div>

            <div v-if="detail.cast.length" class="flex flex-col gap-3">
              <h3 class="text-[0.95rem] font-bold text-white uppercase tracking-widest pb-1.5 border-b border-white/[0.08]">
                Top Cast
              </h3>
              <div class="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                <div
                  v-for="c in detail.cast"
                  :key="c.id"
                  class="bg-white/[0.04] border border-white/[0.07] rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(229,9,20,0.4)]"
                >
                  <div class="w-full aspect-[2/3] overflow-hidden bg-[#1e1e1e]">
                    <img
                      v-if="c.profile_path"
                      :src="`https://image.tmdb.org/t/p/w185${c.profile_path}`"
                      :alt="c.name"
                      class="w-full h-full object-cover block"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-[#1e1e1e]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-500">
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="p-2">
                    <p class="text-[0.75rem] font-bold text-white truncate">{{ c.name }}</p>
                    <p class="text-[0.68rem] text-white/45 truncate">{{ c.character }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="detail.similar.length" class="flex flex-col gap-3">
              <h3 class="text-[0.95rem] font-bold text-white uppercase tracking-widest pb-1.5 border-b border-white/[0.08]">
                More Like This
              </h3>
              <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                <div
                  v-for="s in detail.similar"
                  :key="s.id"
                  class="relative rounded-lg overflow-hidden aspect-video cursor-pointer transition-transform duration-200 hover:scale-[1.04] group"
                  @click="openSimilar(s.id)"
                  role="button"
                  :aria-label="`View details for ${s.title}`"
                >
                  <img :src="s.poster" :alt="s.title" class="w-full h-full object-cover block" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p class="text-[0.72rem] font-bold text-white leading-snug">{{ s.title }}</p>
                    <span class="text-[0.65rem] text-white/65 mt-0.5">⭐ {{ s.vote_average.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
