<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import MovieRow from '@/components/MovieRow.vue';

const props = defineProps<{ query: string }>();

const results = ref<any[]>([]);
const loading = ref(false);
const noResults = ref(false);

const apiKey = import.meta.env.VITE_TMDB_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

let debounceTimer: ReturnType<typeof setTimeout>;

watch(() => props.query, (val) => {
  clearTimeout(debounceTimer);
  if (!val.trim()) {
    results.value = [];
    noResults.value = false;
    return;
  }
  debounceTimer = setTimeout(() => search(val), 400);
});

const search = async (query: string) => {
  loading.value = true;
  noResults.value = false;
  try {
    const res = await axios.get(`${baseUrl}/search/multi`, {
      params: { api_key: apiKey, language: 'en-US', query, page: 1 },
    });
    const mapped = res.data.results
      .filter((r: any) => r.backdrop_path)
      .map((r: any) => ({
        id: r.id,
        title: r.title ?? r.name,
        poster: `${imageBaseUrl}${r.backdrop_path}`,
        vote_average: r.vote_average,
        vote_count: r.vote_count,
      }));
    results.value = mapped;
    noResults.value = mapped.length === 0;
  } catch (e) {
    console.error('Search error:', e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="query.trim()" class="px-4 md:px-12 py-6">
    <p v-if="loading" class="text-gray-400 italic text-sm">Searching...</p>

    <MovieRow
      v-else-if="results.length > 0"
      :title="`Results for &quot;${query}&quot;`"
      :items="results"
    />

    <p v-else-if="noResults" class="text-gray-400 italic text-sm">
      No results found for "{{ query }}".
    </p>
  </div>
</template>
