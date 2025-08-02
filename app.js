// Toggle dark mode
document.getElementById('toggleDark').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

const API_KEY = 'cc68bbe0';
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

// async function to search movies
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await response.json();

    if (data.Response === 'True') {
      resultsContainer.innerHTML = '';
      data.Search.forEach((movie) => {
        // createCard(movie);
      });
    } else {
      resultsContainer.innerHTML = '<p>No results found</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    resultsContainer.innerHTML =
      '<p>Something went wrong. Please try again later.</p>';
  }
}

searchBtn.addEventListener('click', searchMovies);

const modalContent = document.getElementById('modalContent');
const movieModal = document.getElementById('movieModal');
const closeModalBtn = document.getElementById('closeModal');

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
        class="w-full md:w-1/3 rounded-lg object-cover"
      />
      <div class="flex-1 space-y-2">
        <h2 class="text-2xl font-bold">${movie.Title} (${movie.Year})</h2>
        <p class="text-sm text-gray-400">Genre: ${movie.Genre}</p>
        <p class="text-sm text-gray-400">Rated: ${movie.Rated}</p>
        <p class="text-sm text-gray-400">Runtime: ${movie.Runtime}</p>
        <p class="text-sm text-gray-400">Director: ${movie.Director}</p>
        <p class="text-sm text-gray-400">Cast: ${movie.Actors}</p>
        <p class="text-sm text-gray-300 leading-relaxed">${movie.Plot}</p>
        <a
          href="https://www.imdb.com/title/${movie.imdbID}/"
          target="_blank"
          class="inline-block text-sm text-yellow-400 hover:underline mt-2"
        >
          🔗 View on IMDb
        </a>
      </div>
    </div>
  `;

  movieModal.classList.add('hidden');
}
