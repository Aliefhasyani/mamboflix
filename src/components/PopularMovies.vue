<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MovieRow from '@/components/MovieRow.vue'; 

const movies = ref([]);
const loading = ref(true);

const apiKey = import.meta.env.VITE_TMDB_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; 

const fetchMovies = async () => {
  try {
    const response = await axios.get(`${baseUrl}/movie/popular`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
        page: 1,
      },
    });
    
    movies.value = response.data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster: `${imageBaseUrl}${movie.backdrop_path}`, 
    }));
  } catch (error) {
    console.error('Error fetching TMDB data:', error);
  } finally {
    loading.value = false;
  }
};


fetchMovies();

</script>

<template>
  <div>
    <div v-if="loading" class="px-12 py-10 text-gray-500 italic">
      Loading popular movies...
    </div>
    
    <MovieRow 
      v-else-if="movies.length > 0"
      title="Popular on mamboflix" 
      :items="movies" 
    />

   
  </div>
</template>