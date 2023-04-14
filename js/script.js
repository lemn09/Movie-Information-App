// 0. get current page location
const global = {
    currPage: window.location.pathname,
    search: {
        type: "",
        term: "",
        page: 1,
        totalPages: 1,
        totalResult: 1,
    },
    api: {
        apiKey: "9c8fe207719060155337af725192a9b5",
        apiURL: "https://api.themoviedb.org/3",
    }
};

// 0. highlight active link
function highlightActiveLink() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === global.currPage) {
            link.classList.add("active");
        }
    })
}

// 1. fetch API DATA
async function fetchAPIData(endpoint) {

    showSpinner();
    const APIKey = global.api.apiKey;
    const API_URL = global.api.apiURL;

    const response = await fetch(`${API_URL}/${endpoint}?api_key=${APIKey}&language=en-US`);

    const data = await response.json();

    hideSpinner();
    return data;
}

// 1. display and hide loading spinner
function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}


// 1. display popular movies on home page and movie page
async function displayPopularMovies() {
    const { results: data } = await fetchAPIData("/movie/popular");


    const div = document.getElementById("popular-movies");

    data.forEach((movie) => {
        // movie image


        const newDiv = document.createElement("div");
        newDiv.className = "card";

        newDiv.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${movie.poster_path
                ?
                `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`

                :

                `<img src="images/no-image.png" class="card-img-top" alt="${movie.title}" />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
        `

        div.appendChild(newDiv);
    });

}

// 2. display tv shows on tv-show page (tv-show.html)
async function displayTvShows() {
    const { results: data } = await fetchAPIData("/tv/popular");


    const div = document.getElementById("popular-shows");
    data.forEach((show) => {
        const newDiv = document.createElement("div");
        newDiv.className = "card";

        newDiv.innerHTML = `
            
            <a href="tv-details.html?id=${show.id}">
                ${show.poster_path
                ?
                `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.title}" />`
                :
                `<img src="images/no-image.png" class="card-img-top" alt="${show.title}/>`
            }   
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                    <small class="text-muted">Aired: ${show.first_air_date}</small>
                </p>
            </div>
        `

        div.appendChild(newDiv);
    });

}


// 3. show movie details
async function displayMovieDetails() {

    // extracting id from the url of the page
    const id = window.location.search.match(/\d+/)[0];

    const data = await fetchAPIData(`/movie/${id}`);

    displayBackgroundImage("movie", data.backdrop_path);

    const details = document.getElementById("movie-details");

    const top = document.createElement("div");
    top.className = "details-top";

    top.innerHTML = `
        <div>
            ${data.poster_path
            ?
            `<img src="https://image.tmdb.org/t/p/w500${data.poster_path}" class="card-img-top" alt="${data.title}" />`
            :
            `<img src="images/no-image.png" class="card-img-top" alt="${data.title}" />`
        }
        </div>
        <div>
            <h2>${data.title}</h2>
            <p>
                <i class="fas fa-star text-primary"></i>
                 ${data.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${data.release_date}</p>
            <p>
                ${data.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${data.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            <ul >

            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
    `


    const bottom = document.createElement("div");
    bottom.className = "details-bottom";

    bottom.innerHTML = `
        <h2>Movie Info</h2>
        <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommaToNum(data.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommaToNum(data.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${data.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${data.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">
            ${data.production_companies.map((company) => company.name).join(", ")
        }
        </div>
    `


    details.appendChild(top);
    details.appendChild(bottom);

}

// 3. add commas to number, for budget and revenue
function addCommaToNum(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 5. display tv show details
async function dispalyTvDetails() {
    const tv_id = window.location.search.match(/\d+/)[0];
    const data = await fetchAPIData(`/tv/${tv_id}`);

    displayBackgroundImage("show", data.backdrop_path);

    const showDetails = document.getElementById("show-details");

    const div = document.createElement("div");

    div.innerHTML = `

        <div class="details-top">
            <div>
                ${data.poster_path
            ?
            `<img src="https://image.tmdb.org/t/p/w500${data.poster_path}" class="card-img-top" alt="${data.name}" />`
            :
            `<img src="images/no-image.png" class="card-img-top" alt="${data.name}" />`
        }
            </div>
            <div>
                <h2>${data.name}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${data.vote_average.toFixed(1)} / 10
                </p>
                <p class="text-muted">Release Date: ${data.first_air_date}</p>
                <p>${data.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${data.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
                </ul>
                <a href="#" target="_blank" class="btn">Visit Show Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
                <li><span class="text-secondary">Number Of Episodes:</span> ${data.number_of_episodes}</li>
                <li> 
                <span class="text-secondary">Last Episode To Air:</span> ${data.last_episode_to_air.name}
                </li>
                <li><span class="text-secondary">Status:</span> ${data.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group"> ${data.production_companies.map((company) => company.name).join(", ")}</div>
        </div>
    `

    showDetails.appendChild(div);
}

// 4. display background image when on tv show details or movie details
// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '120vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.2';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

// display slider on index page, using slider API
async function displaySlider() {
    // movies on theatre
    const data = await fetchAPIData("/movie/now_playing");


    data.results.forEach((result) => {
        const newSwiperElement = document.createElement("div");
        newSwiperElement.className = "swiper-slide";

        newSwiperElement.innerHTML = `
                <div class="swiper-slide">
                <a href="movie-details.html?id=">
                    ${result.poster_path
                ?
                `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />`
                :
                `<img src="./images/no-image.png" alt="${result.title}" />`
            }
                </a>
                <h4 class="swiper-rating">
                    <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(1)} / 10
                </h4>
                </div>
        `

        document.querySelector(".swiper-wrapper").appendChild(newSwiperElement);

    });

    initSwiper();
}

// 6. swiper api
function initSwiper() {
    const swiper = new Swiper(".swiper", {
        sliderPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 1700,
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
        }
    });
}

//7. search functionality
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.type = urlParams.get("type");
    global.search.term = urlParams.get("search-term");

    if (global.search.term === "" || global.search.term === null) {
        showAlert(`Please enter a search item`);
    } else {
        const { results, total_pages, page, total_results } = await searchAPIData();
        console.log(results);
        console.log(results.length);

        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResult = total_results;

        if (results.length === 0) {
            showAlert("no results found", "success");
            return;
        }

        displaySearchResults(results);
    }

}

// 7. custom alert function
function showAlert(message, className = "error") {
    const customAlert = document.createElement("div");
    customAlert.classList.add("alert", className);
    customAlert.appendChild(document.createTextNode(message));

    document.getElementById("alert").appendChild(customAlert);

    setTimeout(() => customAlert.remove(), 2000);
}

// 7. search API data
async function searchAPIData() {
    showSpinner();
    const APIKey = global.api.apiKey;
    const API_URL = global.api.apiURL;

    const response = await fetch(`${API_URL}/search/${global.search.type}?api_key=${APIKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

    const data = await response.json();

    hideSpinner();
    return data;
}

// 8. display search results
async function displaySearchResults(results) {
    // before display clear page
    document.getElementById("search-results").innerHTML = "";
    document.getElementById("search-results-heading").innerHTML = "";
    document.getElementById("pagination").innerHTML = "";

    const div = document.getElementById("search-results");

    results.forEach((result) => {

        const newDiv = document.createElement("div");
        newDiv.className = "card";

        newDiv.innerHTML = `
            <a href="${global.search.type}-details.html?id=${result.id}">
                ${result.poster_path
                ?
                `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.name}" />`
                :
                `<img src="images/no-image.png" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.name}" />`
            }
                </a>
                <div class="card-body">
                    <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
                    <p class="card-text">
                        <small class="text-muted">${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
                    </p>
                </div>
        `

        div.appendChild(newDiv);
    });


    document.getElementById("search-results-heading").innerHTML = `
        <h2> ${results.length} of ${global.search.totalResult} Results for ${global.search.term}</h2> 
    `

    document.querySelector("#search-term").value = "";

    displayPagination();
}

// 9. create and display pagination for the search
function displayPagination() {
    const div = document.createElement("div");
    div.classList.add("pagination");

    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `

    document.getElementById("pagination").appendChild(div);

    // disable prev if on first page and next if on last page
    if (global.search.page === 1) {
        document.querySelector("#prev").disabled = true;
    }
    if (global.search.page === global.search.totalPages) {
        document.querySelector("#next").disabled = true;
    }

    // next page event listener
    document.querySelector("#next").addEventListener("click", async () => {
        global.search.page++;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
        window.scrollTo(0, 0);
    })

    // prev page button event listener
    document.querySelector("#prev").addEventListener("click", async () => {
        global.search.page--;
        const { results } = await searchAPIData();
        displaySearchResults(results);
        window.scrollTo(0, 0);
    })
}

// 0. intialize function
function init() {
    //page router
    switch (global.currPage) {
        case `/`:
        case `/index.html`:
            console.log("home");
            displayPopularMovies();
            displaySlider();
            break;

        case `/movie-details.html`:
            console.log("movie details");
            displayMovieDetails();
            break;

        case `/search.html`:
            console.log("search");
            search();
            break;

        case `/shows.html`:
            console.log("tv-shows");
            displayTvShows();
            break;

        case `/tv-details.html`: console.log("tv-details");
            dispalyTvDetails();
            break;
    }

    highlightActiveLink();
}

window.addEventListener("DOMContentLoaded", init);