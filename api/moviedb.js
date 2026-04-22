// api/moviedb.js
const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = process.env.EXPO_PUBLIC_TMDB_KEY;

if (!apiKey) {
  console.warn(
    "[moviedb.js] Missing EXPO_PUBLIC_TMDB_KEY. Add it in .env (EXPO_PUBLIC_TMDB_KEY=...)"
  );
}

// endpoints
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day`;
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming`;
const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated`;

const movieDetailsEndpoint = (id) => `${apiBaseUrl}/movie/${id}`;
const movieCreditsEndpoint = (id) => `${apiBaseUrl}/movie/${id}/credits`;

const searchMoviesEndpoint = `${apiBaseUrl}/search/movie`;

const personDetailsEndpoint = (id) => `${apiBaseUrl}/person/${id}`;
const personMoviesEndpoint = (id) => `${apiBaseUrl}/person/${id}/movie_credits`;

// image helpers
export const image500 = (path) => (path ? `https://image.tmdb.org/t/p/w500${path}` : null);
export const image342 = (path) => (path ? `https://image.tmdb.org/t/p/w342${path}` : null);
export const image185 = (path) => (path ? `https://image.tmdb.org/t/p/w185${path}` : null);
export const image780 = (path) => (path ? `https://image.tmdb.org/t/p/w780${path}` : null);

export const fallbackMoviePoster = "https://via.placeholder.com/500x750.png?text=No+Poster";
export const fallbackPersonImage = "https://via.placeholder.com/300x300.png?text=No+Image";

// generic API caller
const apiCall = async (endpoint, params = {}) => {
  if (!apiKey) return { results: [] };

  const qs = new URLSearchParams({
    api_key: apiKey,
    ...Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ),
  });

  const url = `${endpoint}?${qs.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    const data = await res.json();

    if (!res.ok) {
      console.warn("[TMDB] Error:", res.status, data?.status_message || data);
      return { results: [] };
    }
    return data;
  } catch (e) {
    console.warn("[TMDB] Network error:", e?.message || e);
    return { results: [] };
  }
};

// exported functions
export const fetchTrendingMovies = (params) => apiCall(trendingMoviesEndpoint, params);
export const fetchUpcomingMovies = (params) => apiCall(upcomingMoviesEndpoint, params);
export const fetchTopRatedMovies = (params) => apiCall(topRatedMoviesEndpoint, params);

export const fetchMovieDetails = (id, params) => apiCall(movieDetailsEndpoint(id), params);
export const fetchMovieCredits = (id, params) => apiCall(movieCreditsEndpoint(id), params);

export const searchMovies = (params) => apiCall(searchMoviesEndpoint, params);

export const fetchPersonDetails = (id, params) => apiCall(personDetailsEndpoint(id), params);
export const fetchPersonMovies = (id, params) => apiCall(personMoviesEndpoint(id), params);