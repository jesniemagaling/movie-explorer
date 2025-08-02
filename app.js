// Toggle dark mode
document.getElementById('toggleDark').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

const API_KEY = 'cc68bbe0';
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) return;

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === 'True') {
        resultsContainer.innerHTML = '';
        data.Search.forEach((movie) => {
          // createCard(movie);
        });
      } else {
        resultsContainer.innerHTML = '<p>No results found</p>';
      }
    });
});
