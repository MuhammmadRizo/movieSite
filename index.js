// let API_KEY = 'b971c2f0de8767f08d2bb84160ba24b7'

let API_KEY = "dcea1fd7b3e65d34387ad6de7ef9cc5e";

let tokenTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
let tokenPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
let tokenUpComing = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`;

const append = document.querySelector(".append");
const btns = document.querySelectorAll(".btns");
const title = document.querySelector(".title");
const searchPlace = document.querySelector("#search");
const min = document.querySelector("#min");
const max = document.querySelector("#max");

let movieType = window.localStorage.getItem("movieType") || "top_rated";
let pageNumber = window.localStorage.getItem("pageNumber") || 1;
title.textContent = pageNumber;
let filmRelaseDates = [];

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    movieType = e.target.value;
    title.textContent = 1;

    window.localStorage.setItem("movieType", movieType);
    getMovies(movieType, 1);
  });
});

async function getMovies(movieType, pageNumber, searchText, minYear, maxYear) {
  let movieUrl =
    movieType == "upcoming"
      ? tokenUpComing
      : movieType == "popular"
        ? tokenPopular
        : tokenTop;
  let getMoviesType = await axios.get(movieUrl + `&page=${pageNumber}`);
  let movieData = getMoviesType.data.results;

  movieData = searchText
    ? movieData.filter((movie) =>
        movie.original_title.toLowerCase().includes(String(searchText)),
      )
    : movieData;

  movieData = movieData.filter((movie) => {
    if (!movie.release_date) return false;
    let releaseYear = Number(movie.release_date.split("-")[0]);

    let matchesMin = minYear ? releaseYear >= minYear : true;
    let matchesMax = maxYear ? releaseYear <= maxYear : true;

    return matchesMin && matchesMax;
  });

  append.innerHTML = "";
  for (const movie of movieData) {
    append.innerHTML += `
    <h1>Salom</h1>
              <div class="movie">
                <a href="https://adilovdev.uz" target="_blank">
                    <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="${movie.title}">
                  <div class="movie-info">
                    <h3>${movie.original_title}</h3>
                    <span class="orange">${Math.floor(movie.vote_average)}</span>
                  </div>
                  <span class="date">${movie.release_date}</span>         
                  <span class="overview">${movie.overview}</span>
                </a>
              </div>
          `;
  }
}

function nextButn() {
  pageNumber = +title.textContent + 1;
  window.localStorage.setItem("pageNumber", pageNumber);
  title.textContent = pageNumber;

  getMovies(movieType, pageNumber);
}

function prevButn() {
  let pageNumber = +title.textContent - 1;
  if (pageNumber < 1) return;
  window.localStorage.setItem("pageNumber", pageNumber);
  title.textContent = pageNumber;

  getMovies(movieType, pageNumber);
}

searchPlace.addEventListener("input", (e) => {
  let searchText = e.target.value;

  getMovies(movieType, pageNumber, searchText);
});

min.addEventListener("input", (e) => {
  let minYear = Number(min.value);

  getMovies(movieType, pageNumber, minYear);
});

max.addEventListener("input", (e) => {
  let maxYear = Number(max.value);

  getMovies(movieType, pageNumber, minYear, maxYear);
});

getMovies(movieType, pageNumber);
