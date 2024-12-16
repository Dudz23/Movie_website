const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const BASE_IMAGE_URL = 'http://image.tmdb.org/t/p/w500';

function getMovieIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
        const movie = response.data;
        
        document.getElementById('movieMainDetails').innerHTML = `
            <div class="movie-poster">
                <img src="${BASE_IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="movie-header">
                <h1>${movie.title}</h1>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const movieId = getMovieIdFromURL();
    if (movieId) {
        fetchMovieDetails(movieId);
    }
});