const global = {
    currentPage: window.location.pathname,
};

//GET 20 Popular Movies
async function displayPopularMovies(){
    const {results} = await fetchAPIData('movie/popular');
    console.log(results);

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <div class="card">
            <a href="movie-details.html?id=${movie.id}">
                ${movie.poster_path?
                    `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.title}"/>`
                    : 
                    `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.title}"
                />`
                }
            </a>
            <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
            </div>
        </div>
        `;

        document.querySelector('#popular-movies').appendChild(div);
    });
}

//Highlight Active Link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    }) 

}

//fetch data from TMDB api
async function fetchAPIData(endpoint){
    const API_KEY = '67ee3f999e08c3384b5ea24285d77713';
    const API_URL = 'https://api.themoviedb.org/3/';

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    return data;
}

//Slider Movie
async function displaySilder() {
    const { results } = await fetchAPIData('movie/now_playing');

    // console.log(results);

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');

        div.innerHTML = `          
            <a href="movie-details.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>`;

        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
   
    });
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1, 
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 3000, 
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            },
        },
    });
}


//Movie Details
async function displayMovieDetails() {
    const movieID = window.location.search.split('=')[1];

    console.log(movieID);

    const movie = await fetchAPIData(`movie/${movieID}`);


    const div = document.createElement('div');

    div.innerHTML = `
    <div class="details-top">
          <div>
          ${movie.poster_path?
            `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"/>`
            : 
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
        />`
        }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => 
                `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
 
      </div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="container">
        <div class="logo"><span>FLIXX</span></div>
        <div class="social-links">
          <a href="https://www.facebook.com" target="_blank"
            ><i class="fab fa-facebook-f"></i
          ></a>
          <a href="https://www.twitter.com" target="_blank"
            ><i class="fab fa-twitter"></i
          ></a>
          <a href="https://www.instagram.com" target="_blank"
            ><i class="fab fa-instagram"></i
          ></a>
        </div>
    `;

    document.querySelector('#movie-details').appendChild(div);
}


//Init App
function init() {
    switch(global.currentPage){
        case '/':
        case '/index.html':
            // console.log('Home');
            displaySilder();
            displayPopularMovies();
            break;

        case '/movie-details.html':
            displayMovieDetails();
            break;

        case '/tv-details.html':
            displayShowDetails(); 
            break;

        case '/search.html':
            console.log('Search');
            break;
    }

    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);

