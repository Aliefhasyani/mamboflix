<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import PopularMovies from '@/components/PopularMovies.vue';
import PopularTv from '@/components/PopularTv.vue';
import SearchResults from '@/components/SearchResults.vue';
import Watchlist from '@/pages/Watchlist.vue';
import MovieDetailModal from '@/components/MovieDetailModal.vue';

const searchQuery = ref('');
const currentPage = ref<'home' | 'watchlist'>('home');

const handleNavigate = (page: string) => {
  currentPage.value = page as 'home' | 'watchlist';
  searchQuery.value = '';
};

const selectedId = ref<number | null>(null);
const selectedType = ref<'movie' | 'tv'>('movie');

const openDetail = (id: number, type: 'movie' | 'tv') => {
  selectedId.value = id;
  selectedType.value = type;
};

const closeDetail = () => {
  selectedId.value = null;
};
</script>

<template>
  <MovieDetailModal
    :item-id="selectedId"
    :item-type="selectedType"
    @close="closeDetail"
    @open-similar="openDetail"
  />

  <Watchlist v-if="currentPage === 'watchlist'" @navigate="handleNavigate" @select="openDetail" />

  <div v-else class="bg-brand-dark min-h-screen text-white font-sans overflow-x-hidden">
    <Navbar @search="searchQuery = $event" @navigate="handleNavigate" />

    <header class="relative h-[80vh] flex items-center px-8 md:px-16">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=2070"
             class="w-full h-full object-cover brightness-50" alt="Hero Background">
        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
      </div>
      <!-- hard code saja filmnya karena cuma untuk kebutuhan ui :DD -->
      <div class="relative z-10 max-w-2xl">
        <h1 class="font-display text-6xl md:text-8xl mb-4 tracking-wide uppercase">
          Stranger Things
        </h1>
        <p class="text-lg md:text-xl mb-6 text-gray-200 leading-relaxed">
          When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.
        </p>
        
      </div>
    </header>

    <main class="relative z-20 -mt-24 space-y-10 pb-20">
      <SearchResults :query="searchQuery" @select="openDetail" />

      <template v-if="!searchQuery.trim()">
        <PopularMovies @select="openDetail" />
        <PopularTv @select="openDetail" />
      </template>
    </main>

    <Footer></Footer>
  </div>
</template>