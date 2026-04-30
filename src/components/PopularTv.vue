<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MovieRow from '@/components/MovieRow.vue';

const tvShows = ref([]);
const loading = ref(true);

const apiKey = import.meta.env.VITE_TMDB_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; 

const fetchTVShows = async () => {
  try {
    const response = await axios.get(`${baseUrl}/tv/popular`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
        page: 1,
      },
    });
    
    tvShows.value = response.data.results.map((tv: any) => ({
      id: tv.id,
      title: tv.name,
      poster: `${imageBaseUrl}${tv.backdrop_path}`,
      vote_average: tv.vote_average,
      vote_count: tv.vote_count,
    }));
  } catch (error) {
    console.error('Error fetching TV data:', error);
  } finally {
    loading.value = false;
  }
};

fetchTVShows();
</script>

<template>
  <div>
    <div v-if="loading" class="px-12 py-10 text-gray-500 italic">
      Loading popular TV shows...
    </div>
    
    <MovieRow 
      v-else
      title="Popular TV Shows" 
      :items="tvShows"
      itemType="tv"
    />
  </div>
</template>