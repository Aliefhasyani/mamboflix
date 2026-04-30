<script setup lang="ts">
  import { ref } from 'vue';
import MovieRow from '../components/MovieRow.vue'; 

const popularMovies = ref([...Array(10)]); 
</script>

<template>
  <MovieRow 
    title="Popular on Mamboflix" 
    :items="popularMovies" 
  />
</template>