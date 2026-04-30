<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import PopularMovies from '@/components/PopularMovies.vue';
import PopularTv from '@/components/PopularTv.vue';

</script>

<template>
  <div class="bg-brand-dark min-h-screen text-white font-sans overflow-x-hidden">
    <Navbar />

    <header class="relative h-[80vh] flex items-center px-8 md:px-16">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=2070" 
             class="w-full h-full object-cover brightness-50" alt="Hero Background">
        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
      </div>

      <div class="relative z-10 max-w-2xl">
        <h1 class="font-display text-6xl md:text-8xl mb-4 tracking-wide uppercase">
          Stranger Things
        </h1>
        <p class="text-lg md:text-xl mb-6 text-gray-200 leading-relaxed">
          When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.
        </p>
        <div class="flex gap-3 font-sans">
          <button class="bg-white text-black px-8 py-2 rounded font-bold hover:bg-gray-200 transition">
             Play
          </button>
          <button class="bg-gray-500/70 text-white px-8 py-2 rounded font-bold hover:bg-gray-600/70 transition">
             More Info
          </button>
        </div>
      </div>
    </header>

    <main class="relative z-20 -mt-24 space-y-10 pb-20">
      
      <PopularMovies></PopularMovies>
      <PopularTv></PopularTv>

 

    </main>

    <Footer></Footer>
  </div>
</template>