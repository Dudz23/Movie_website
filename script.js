const API_KEY = '1bfdbff05c2698dc917dd28c08d41096';
const BASE_IMAGE_URL = 'http://image.tmdb.org/t/p/w500';


const upcomingMoviesList = document.getElementById('upcomingMoviesList');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResultsList = document.getElementById('searchResultsList');
const movieDetailModal = document.getElementById('movieDetailModal');
const movieDetails = document.getElementById('movieDetails');
const similarMoviesModal = document.getElementById('similarMovies');
const closeModal = document.querySelector('.close-modal');

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

        movieCard.addEventListener('click', () => {
            window.location.href = `movie_details.html?id=${movie.id}`;
        });

        container.appendChild(movieCard);
    });
}

async function fetchMovieDetails(movieId) {
    try {
        const [detailResponse, similarResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`)
        ]);

        const movie = detailResponse.data;
        const similarMoviesList = similarResponse.data.results;

        displayMovieDetails(movie, similarMoviesList);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayMovieDetails(movie, similarMovies) {
    const posterPath = movie.poster_path ? 
        `${BASE_IMAGE_URL}${movie.poster_path}` : 
        'https://via.placeholder.com/300x450?text=No+Image';

    movieDetails.innerHTML = `
        <div class="movie-detail-container">
            <img src="${posterPath}" alt="${movie.title}" class="movie-detail-poster">
            <div class="movie-detail-info">
                <h2>${movie.title}</h2>
                <p><strong>Overview:</strong> ${movie.overview}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
                <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
                <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
            </div>
        </div>
    `;

    displayMovies(similarMovies, document.getElementById('similarMovies'));

    movieDetailModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    movieDetailModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === movieDetailModal) {
        movieDetailModal.style.display = 'none';
    }
});

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies();
});

fetchUpcomingMovies();