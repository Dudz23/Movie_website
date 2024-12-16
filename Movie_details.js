const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const BASE_IMAGE_URL = 'http://image.tmdb.org/t/p/w500';

const movieMainDetails = document.getElementById('movieMainDetails');
const movieSynopsis = document.getElementById('movieSynopsis');
const movieMetadata = document.getElementById('movieMetadata');
const movieCast = document.getElementById('movieCast');
const similarMoviesList = document.getElementById('similarMoviesList');



function getMovieIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchMovieDetails(movieId) {
    try {
      
        const [detailResponse, creditsResponse, similarResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`)
        ]);

        const movie = detailResponse.data;
        const credits = creditsResponse.data;
        const similarMovies = similarResponse.data.results;

        
        renderMovieDetails(movie, credits);
        renderSimilarMovies(similarMovies);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        movieMainDetails.innerHTML = `
            <div class="error-message">
                <h2>Oops! Something went wrong</h2>
                <p>Unable to fetch movie details. Please try again later.</p>
            </div>
        `;
    }
}

function renderMovieDetails(movie, credits) {
    const posterPath = movie.poster_path 
        ? `${BASE_IMAGE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/300x450?text=No+Image';


        movieMainDetails.innerHTML = `
        <div class="movie-poster">
            <img src="${posterPath}" alt="${movie.title}">
        </div>
        <div class="movie-header">
            <h1>${movie.title}</h1>
            <div class="movie-quick-stats">
                <span>⭐ ${movie.vote_average.toFixed(1)}/10</span>
                <span>🕒 ${movie.runtime} mins</span>
                <span>📅 ${movie.release_date}</span>
            </div>
        </div>
    `;

    movieSynopsis.textContent = movie.overview;

    movieMetadata.innerHTML = `
        <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Production Companies:</strong> ${movie.production_companies.map(c => c.name).join(', ')}</p>
        <p><strong>Original Language:</strong> ${movie.original_language}</p>
        <p><strong>Budget:</strong> $${movie.budget.toLocaleString()}</p>
        <p><strong>Revenue:</strong> $${movie.revenue.toLocaleString()}</p>
    `;

    movieCast.innerHTML = credits.cast.slice(0, 8).map(actor => `
        <div class="cast-member">
            <img src="${actor.profile_path 
                ? BASE_IMAGE_URL + actor.profile_path 
                : 'https://via.placeholder.com/100x150?text=Actor'}" 
                 alt="${actor.name}">
            <p>${actor.name}</p>
            <small>as ${actor.character}</small>
        </div>
    `).join('');

}

function renderSimilarMovies(movies) {
    similarMoviesList.innerHTML = movies.slice(0, 6).map(movie => `
        <div class="movie-card" onclick="navigateToMovieDetails(${movie.id})">
            <img src="${movie.poster_path 
                ? BASE_IMAGE_URL + movie.poster_path 
                : 'https://via.placeholder.com/300x450?text=No+Image'}" 
                 alt="${movie.title}">
            <div class="movie-card-details">
                <h4>${movie.title}</h4>
                <p>Rating: ${movie.vote_average.toFixed(1)}</p>
            </div>
        </div>
        
    `).join('');
}

function navigateToMovieDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const movieId = getMovieIdFromURL();
    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        movieMainDetails.innerHTML = '<p>No movie selected</p>';
    }
});

