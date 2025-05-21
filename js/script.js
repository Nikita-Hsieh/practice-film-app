// 全域狀態
const global = {
	currentPage: window.location.pathname,
}

// Highlight Active Link
function highlightActiveLink() {
	const links = document.querySelectorAll('.nav-link')
	links.forEach((link) => {
		if (
			link.getAttribute('href') ===
			'./' + global.currentPage.split('/').pop()
		) {
			link.classList.add('active')
		}
	})
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
	const API_KEY = '67ee3f999e08c3384b5ea24285d77713'
	const API_URL = 'https://api.themoviedb.org/3/'

	const response = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	)
	const data = await response.json()
	return data
}

// Display Popular Movies
async function displayPopularMovies() {
	const { results } = await fetchAPIData('movie/popular')

	results.forEach((movie) => {
		const div = document.createElement('div')
		div.classList.add('card')

		div.innerHTML = `
        <a href="./movie-details.html?id=${movie.id}">
          ${
						movie.poster_path
							? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
							: `<img src="./images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
					}
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
      `
		document.querySelector('#popular-movies').appendChild(div)
	})
}

// Display Slider
async function displaySlider() {
	const { results } = await fetchAPIData('movie/now_playing')

	results.forEach((movie) => {
		const div = document.createElement('div')
		div.classList.add('swiper-slide')

		div.innerHTML = `
        <a href="./movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
        </h4>`

		document.querySelector('.swiper-wrapper').appendChild(div)
	})

	initSwiper()
}

// Swiper 初始化
function initSwiper() {
	new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	})
}

// 顯示單一電影細節
async function displayMovieDetails() {
	const movieID = new URLSearchParams(window.location.search).get('id')
	if (!movieID) return

	const movie = await fetchAPIData(`movie/${movieID}`)

	const div = document.createElement('div')

	div.innerHTML = `
      <div class="details-top">
        <div>
          ${
						movie.poster_path
							? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
							: `<img src="./images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
					}
        </div>
        <div>
          <h2>${movie.title}</h2>
          <p><i class="fas fa-star text-primary"></i> ${movie.vote_average.toFixed(
						1
					)} / 10</p>
          <p class="text-muted">Release Date: ${movie.release_date}</p>
          <p>${movie.overview}</p>
          <h5>Genres</h5>
          <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
          </ul>
          ${
						movie.homepage
							? `<a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>`
							: ''
					}
        </div>
      </div>
    `

	document.querySelector('#movie-details').appendChild(div)
}

// Init
function init() {
	const page = global.currentPage.split('/').pop() // like 'index.html'

	if (!page || page === 'index.html') {
		displaySlider()
		displayPopularMovies()
	} else if (page === 'movie-details.html') {
		displayMovieDetails()
	} else if (page === 'tv-details.html') {
		displayShowDetails?.()
	}

	highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
