import { ref, computed } from 'vue';

export interface WatchlistItem {
  id: number;
  title: string;
  poster: string;
  vote_average: number;
  vote_count: number;
  type?: 'movie' | 'tv';
  addedAt: number;
}

const STORAGE_KEY = 'mamboflix_watchlist';

const watchlist = ref<WatchlistItem[]>(loadFromStorage());

function loadFromStorage(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist.value));
}

export function useWatchlist() {
  const isInWatchlist = (id: number) =>
    watchlist.value.some((item) => item.id === id);

  const addToWatchlist = (item: Omit<WatchlistItem, 'addedAt'>) => {
    if (isInWatchlist(item.id)) return;
    watchlist.value.unshift({ ...item, addedAt: Date.now() });
    saveToStorage();
  };

  const removeFromWatchlist = (id: number) => {
    watchlist.value = watchlist.value.filter((item) => item.id !== id);
    saveToStorage();
  };

  const toggleWatchlist = (item: Omit<WatchlistItem, 'addedAt'>) => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const watchlistCount = computed(() => watchlist.value.length);

  return {
    watchlist,
    watchlistCount,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
}
