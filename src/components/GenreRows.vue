<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MovieRow from '@/components/MovieRow.vue';

const emit = defineEmits<{
  (e: 'select', id: number, type: 'movie' | 'tv'): void;
}>();

const apiKey = import.meta.env.VITE_TMDB_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const GENRES = [
  { id: 28,    name: 'Action' },
  { id: 35,    name: 'Comedy' },
  { id: 27,    name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878,   name: 'Science Fiction' },
  { id: 18,    name: 'Drama' },
  { id: 16,    name: 'Animation' },
  { id: 53,    name: 'Thriller' },
];

interface GenreRow {
  id: number;
  name: string;
  items: any[];
  loading: boolean;
}

const genreRows = ref<GenreRow[]>(
  GENRES.map(g => ({ ...g, items: [], loading: true }))
);

const fetchGenre = async (row: GenreRow) => {
  try {
    const response = await axios.get(`${baseUrl}/discover/movie`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
        sort_by: 'popularity.desc',
        with_genres: row.id,
        page: 1,
      },
    });
    row.items = response.data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.backdrop_path
        ? `${imageBaseUrl}${movie.backdrop_path}`
        : `${imageBaseUrl}${movie.poster_path}`,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
    }));
  } catch (error) {
    console.error(`Error fetching genre ${row.name}:`, error);
  } finally {
    row.loading = false;
  }
};

onMounted(() => {
  genreRows.value.forEach(row => fetchGenre(row));
});
</script>

<template>
  <div class="space-y-10">
    <template v-for="row in genreRows" :key="row.id">
      <div v-if="row.loading" class="px-12 py-4 text-gray-500 italic text-sm">
        Loading {{ row.name }}...
      </div>
      <MovieRow
        v-else-if="row.items.length > 0"
        :title="row.name"
        :items="row.items"
        itemType="movie"
        @select="(id, type) => emit('select', id, type)"
      />
    </template>
  </div>
</template>
