import { ref } from 'vue';
import axios from 'axios';

const apiKey = import.meta.env.VITE_TMDB_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/';

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface VideoResult {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface SimilarItem {
  id: number;
  title: string;
  poster: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetail {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  first_air_date: string;
  runtime: number | null;
  number_of_seasons: number | null;
  number_of_episodes: number | null;
  genres: Genre[];
  status: string;
  original_language: string;
  popularity: number;
  cast: CastMember[];
  trailer: VideoResult | null;
  similar: SimilarItem[];
  type: 'movie' | 'tv';
}

export function useMovieDetail() {
  const detail = ref<MovieDetail | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDetail = async (id: number, type: 'movie' | 'tv') => {
    loading.value = true;
    error.value = null;
    detail.value = null;

    try {
      const [mainRes, creditsRes, videosRes, similarRes] = await Promise.all([
        axios.get(`${baseUrl}/${type}/${id}`, {
          params: { api_key: apiKey, language: 'en-US' },
        }),
        axios.get(`${baseUrl}/${type}/${id}/credits`, {
          params: { api_key: apiKey, language: 'en-US' },
        }),
        axios.get(`${baseUrl}/${type}/${id}/videos`, {
          params: { api_key: apiKey, language: 'en-US' },
        }),
        axios.get(`${baseUrl}/${type}/${id}/similar`, {
          params: { api_key: apiKey, language: 'en-US', page: 1 },
        }),
      ]);

      const d = mainRes.data;
      const cast: CastMember[] = (creditsRes.data.cast ?? []).slice(0, 12).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
      }));

      const trailer: VideoResult | null =
        videosRes.data.results.find(
          (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
        ) ??
        videosRes.data.results.find((v: any) => v.site === 'YouTube') ??
        null;

      const similar: SimilarItem[] = (similarRes.data.results ?? [])
        .filter((s: any) => s.backdrop_path)
        .slice(0, 8)
        .map((s: any) => ({
          id: s.id,
          title: s.title ?? s.name,
          poster: `${imageBaseUrl}w500${s.backdrop_path}`,
          vote_average: s.vote_average,
          vote_count: s.vote_count,
        }));

      detail.value = {
        id: d.id,
        title: d.title ?? d.name,
        tagline: d.tagline ?? '',
        overview: d.overview ?? '',
        poster_path: d.poster_path ? `${imageBaseUrl}w500${d.poster_path}` : '',
        backdrop_path: d.backdrop_path ? `${imageBaseUrl}original${d.backdrop_path}` : '',
        vote_average: d.vote_average ?? 0,
        vote_count: d.vote_count ?? 0,
        release_date: d.release_date ?? '',
        first_air_date: d.first_air_date ?? '',
        runtime: d.runtime ?? null,
        number_of_seasons: d.number_of_seasons ?? null,
        number_of_episodes: d.number_of_episodes ?? null,
        genres: d.genres ?? [],
        status: d.status ?? '',
        original_language: d.original_language ?? '',
        popularity: d.popularity ?? 0,
        cast,
        trailer,
        similar,
        type,
      };
    } catch (e) {
      console.error('Error fetching detail:', e);
      error.value = 'Failed to load details.';
    } finally {
      loading.value = false;
    }
  };

  const clearDetail = () => {
    detail.value = null;
    error.value = null;
  };

  return { detail, loading, error, fetchDetail, clearDetail };
}
