const API_KEY = "69c30683"; 
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const moviesGrid = document.getElementById('moviesGrid');
const statusMessage = document.getElementById('statusMessage');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

async function fetchMovies(movieTitle) {
    // Reset status visual indicators
    statusMessage.classList.remove('d-none');
    moviesGrid.innerHTML = '';

    try {
        const response = await fetch(`${BASE_URL}s=${encodeURIComponent(movieTitle)}`);
        const data = await response.json();

        statusMessage.classList.add('d-none');

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            moviesGrid.innerHTML = `<div class="col-12 text-center text-danger fs-5">⚠️ Error: ${data.Error}</div>`;
        }
    } catch (error) {
        statusMessage.classList.add('d-none');
        moviesGrid.innerHTML = `<div class="col-12 text-center text-danger fs-5">🚨 Critical network failure. Please try again.</div>`;
        console.error("AJAX Fetch Error:", error);
    }
}


function displayMovies(moviesList) {
    moviesList.forEach(movie => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

        const cardCol = document.createElement('div');
        cardCol.className = 'col';

        cardCol.innerHTML = `
            <div class="card h-100 movie-card text-white">
                <img src="${poster}" class="card-img-top poster-img" alt="${movie.Title}">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 class="card-title text-warning fw-bold mb-1">${movie.Title}</h5>
                        <p class="card-text text-muted small mb-3">Year: ${movie.Year}</p>
                    </div>
                    <span class="badge bg-secondary align-self-start text-uppercase">${movie.Type}</span>
                </div>
            </div>
        `;

        moviesGrid.appendChild(cardCol);
    });
}