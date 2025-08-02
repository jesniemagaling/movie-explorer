// Toggle dark mode
const toggleDarkBtn = document.getElementById('toggleDark');
const darkModeIcon = document.getElementById('darkModeIcon');

const moonSVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
</svg>`;

const sunSVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="5" stroke-linecap="round" stroke-linejoin="round" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
</svg>`;

toggleDarkBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');

  // Fade out
  darkModeIcon.classList.add('opacity-0');

  setTimeout(() => {
    darkModeIcon.innerHTML = isDark ? sunSVG : moonSVG;
    darkModeIcon.classList.remove('opacity-0');
  }, 200);
});

const API_KEY = 'cc68bbe0';
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

const modalContent = document.getElementById('modalContent');
const movieModal = document.getElementById('movieModal');
const closeModalBtn = document.getElementById('closeModal');

// Render movie cards in the results container
function renderMovieCard(movie) {
  const poster =
    movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/300x450?text=No+Image';
  return `
    <div
      class="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
      data-imdbid="${movie.imdbID}"
    >
      <img src="${poster}" alt="${movie.Title}" class="w-full h-64 object-cover" />
      <div class="p-3">
        <h3 class="text-white font-semibold text-base truncate">${movie.Title}</h3>
        <p class="text-gray-400 text-sm">${movie.Year}</p>
      </div>
    </div>
  `;
}

function showModalDetails(movie) {
  modalContent.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <img
        src="${
          movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/300x450'
        }"
        alt="${movie.Title}"
        class="w-full md:w-1/3 rounded-lg object-cover max-h-[420px] mx-auto md:mx-0 order-2 md:order-1"
      />
      <div class="flex-1 space-y-3 px-2 md:px-0 order-1 md:order-2">
        <h2 class="text-xl md:text-2xl font-semibold">${
          movie.Title
        } <span class="text-gray-400 font-normal">(${movie.Year})</span></h2>
        <p class="text-sm text-gray-400"><strong>Genre:</strong> ${
          movie.Genre || 'N/A'
        }</p>
        <p class="text-sm text-gray-400"><strong>Rated:</strong> ${
          movie.Rated || 'N/A'
        }</p>
        <p class="text-sm text-gray-400"><strong>Runtime:</strong> ${
          movie.Runtime || 'N/A'
        }</p>
        <p class="text-sm text-gray-400"><strong>Director:</strong> ${
          movie.Director || 'N/A'
        }</p>
        <p class="text-sm text-gray-400"><strong>Cast:</strong> ${
          movie.Actors || 'N/A'
        }</p>
        <p class="text-sm text-gray-300 leading-relaxed line-clamp-5">${
          movie.Plot || 'No plot available.'
        }</p>
        <a
          href="https://www.imdb.com/title/${movie.imdbID}/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block text-sm text-emerald-400 hover:underline mt-2"
        >
          🔗 View on IMDb
        </a>
      </div>
    </div>
  `;

  movieModal.classList.remove('hidden');
}

// Fetch detailed info by imdbID and show modal
async function fetchMovieDetails(imdbID) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const movie = await response.json();

    if (movie.Response === 'True') {
      showModalDetails(movie);
    } else {
      alert('Movie details not found.');
    }
  } catch (error) {
    alert('Failed to fetch movie details.');
    console.error(error);
  }
}

// Search movies by title
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await response.json();

    if (data.Response === 'True') {
      resultsContainer.innerHTML = data.Search.map(renderMovieCard).join('');
      attachMovieCardListeners();
    } else {
      resultsContainer.innerHTML =
        '<p class="text-gray-400">No results found</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    resultsContainer.innerHTML =
      '<p class="text-red-500">Something went wrong. Please try again later.</p>';
  }
}

// Add click event to each movie card to open modal with details
function attachMovieCardListeners() {
  const cards = resultsContainer.querySelectorAll('[data-imdbid]');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const imdbID = card.getAttribute('data-imdbid');
      fetchMovieDetails(imdbID);
    });
  });
}

// Close modal on button click or background click
closeModalBtn.addEventListener('click', () => {
  movieModal.classList.add('hidden');
  modalContent.innerHTML = '';
});

movieModal.addEventListener('click', (e) => {
  if (e.target === movieModal) {
    movieModal.classList.add('hidden');
    modalContent.innerHTML = '';
  }
});

searchBtn.addEventListener('click', searchMovies);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchMovies();
});
