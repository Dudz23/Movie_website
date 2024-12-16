const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const BASE_IMAGE_URL = 'http://image.tmdb.org/t/p/w500';

const upcomingMoviesList = document.getElementById('upcomingMoviesList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResultsList = document.getElementById('searchResultsList');

async function fetchUpcomingMovies() {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
        displayMovies(response.data.results, upcomingMoviesList);
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
    }
}

async function searchMovies() {
    const query = searchInput.value;
    if (!query) return;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
        displayMovies(response.data.results, searchResultsList);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const posterPath = movie.poster_path ? 
            `${BASE_IMAGE_URL}${movie.poster_path}` : 
            'https://via.placeholder.com/300x450?text=No+Image';

        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-card-details">
                <h3>${movie.title}</h3>
                <p>Release: ${movie.release_date}</p>
            </div>
        `;

        container.appendChild(movieCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchUpcomingMovies);

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies();
});