import {
  comHeader,
  comFooter,
  comNavbar,
  comSlideLarge,
  comSlideSmall,
  comDetailMovie,
  comDetailActor,
  slideImage,
  comListMovie,
  comListMoviesOfActor,
} from "./layout.js";
import { DBProvider } from "./moduleProvider.js";
import { computed } from "vue";

const dbProvider = new DBProvider();

export default {
  data() {
    return {
      isDarkMode: false,
      page: 1,
      per_page: 9,
      total_pages: 0,
      movies: [],
      movie: {},
      actor: {},
      content: "",
      topBoxOfficeMovies: [],
      mostPopularMovies: [],
      topRatingMovies: [],
      reviews: [],
      isLoading: true,
      listMovieOfActor: [],
      dataSearch: [],
      tempQuery: "",
      tempTypeSearch: "",
    };
  },
  provide() {
    return {
      movies: computed(() => this.movies),
      page: computed(() => this.page),
      total_pages: computed(() => this.total_pages),
      movie: computed(() => this.movie),
      actor: computed(() => this.actor),
      reviews: computed(() => this.reviews),
      topBoxOfficeMovies: computed(() => this.topBoxOfficeMovies),
      mostPopularMovies: computed(() => this.mostPopularMovies),
      topRatingMovies: computed(() => this.topRatingMovies),
      listMovieOfActor: computed(() => this.listMovieOfActor),
      dataSearch: computed(() => this.dataSearch),
      tempTypeSearch: computed(() => this.tempTypeSearch),
    };
  },
  methods: {
    toggleMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    async loadMoviesFromSearch(page = 1, pattern, cls = "movie") {
      if (pattern) {
        try {
          const query = `search/${cls}/${pattern}?page=${page}&per_page=${this.per_page}`;
          const data = await dbProvider.fetch(query);
          this.dataSearch = data.items;
          this.page = page;
          this.total_pages = data.total_page;
        } catch (error) {
          console.error("Error loading movies:", error);
        }
      }
    },
    async loadListMovieOfActor(page = 1, actorId) {
      try {
        this.per_page = 6;
        const query = `movie/actor-movies/${actorId}?page=${page}&per_page=${this.per_page}`;
        const data = await dbProvider.fetch(query);
        this.listMovieOfActor = data.items;
        this.page = data.page;
        this.total_pages = data.total_page;
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    },
    async loadTopBoxOffice() {
      this.isLoading = true;
      try {
        const query = `movie/topboxoffice/?per_page=5&page=1`;
        const data = await dbProvider.fetch(query);
        this.topBoxOfficeMovies = data.items;
      } catch (error) {
        console.error("Error loading movies:", error);
      }
      this.isLoading = false;
    },
    async loadMostPopularMovies() {
      this.isLoading = true;
      try {
        const query = `get/mostpopular/?per_page=20&page=1`;
        const data = await dbProvider.fetch(query);
        this.mostPopularMovies = data.items;
      } catch (error) {
        console.error("Error loading movies:", error);
      }
      this.isLoading = false;
    },
    async loadTopRating() {
      this.isLoading = true;
      try {
        const query = `get/top50/?per_page=20&page=1`;
        const data = await dbProvider.fetch(query);
        this.topRatingMovies = data.items;
      } catch (error) {
        console.error("Error loading movies:", error);
      }
      this.isLoading = false;
    },

    async loadDataHome() {
      await this.loadTopBoxOffice();
      await this.loadMostPopularMovies();
      await this.loadTopRating();
      this.isLoading = false;
    },

    async loadActorDetail(actorId) {
      this.isLoading = true;
      try {
        const query = `detail/name/${actorId}`;
        const data = await dbProvider.fetch(query);
        if (data.detail) {
          this.actor = data.detail;
          this.content = "actorDetail";
          await this.loadListMovieOfActor(1, actorId);
        } else {
          console.error("Actor not found");
          alert("Not found detail information of this actor.");
        }
      } catch (error) {
        console.error("Error loading movie detail:", error);
      }

      this.isLoading = false;
    },
    async loadReview(movieId) {
      this.isLoading = true;
      try {
        const query = `review/review/${movieId}`;
        const data = await dbProvider.fetch(query);
        if (data.filteredReviews) {
          this.reviews = data.filteredReviews[0].items;
          this.reviews = this.reviews.map((review) => ({
            ...review,
            collapsedReviews: true,
          }));
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error loading movie detail:", error);
      }
      this.isLoading = false;
    },
    async loadMovieDetail(movieId) {
      this.isLoading = true;
      this.tempQuery = "";
      this.tempTypeSearch = "";
      this.dataSearch = [];
      try {
        const query = `detail/movie/${movieId}`;
        const data = await dbProvider.fetch(query);
        if (data.detail) {
          this.movie = data.detail;
          this.content = "movieDetail";
          await this.loadReview(movieId);
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error loading movie detail:", error);
      }
      this.isLoading = false;
    },
    resetData() {
      this.movie = {};
      this.actor = {};
      this.reviews = [];
      this.content = "";
      this.tempQuery = "";
      this.tempTypeSearch = "";
    },
    async handleSearch(payload) {
      this.content = "search";
      const { query, type } = payload;
      if (query != "") {
        this.tempQuery = query;
        this.tempTypeSearch = type;
        await this.loadMoviesFromSearch(1, query, type);
      }
    },
    async loadPage(page) {
      if (this.content === "search") {
        await this.loadMoviesFromSearch(
          page,
          this.tempQuery,
          this.tempTypeSearch
        );
      }
      if (this.content === "actorDetail") {
        await this.loadListMovieOfActor(page, this.actor.id);
      }
    },
  },
  async mounted() {
    await this.loadDataHome();
  },
  computed: {
    modeClass() {
      return this.isDarkMode ? "dark-mode" : "light-mode";
    },
  },

  components: {
    comHeader,
    comFooter,
    comNavbar,
    comSlideLarge,
    comSlideSmall,
    comDetailMovie,
    comDetailActor,
    slideImage,
    comListMovie,
    comListMoviesOfActor,
  },
  template: `
        <div :class="modeClass">
            <div class="container">
                <!-- Header -->
                <div class="row py-2">
                    <div class="col-12 p-0">
                        <comHeader :is-dark-mode="isDarkMode" @toggle-mode="toggleMode"/>
                    </div>
                </div>

                <!-- Navbar -->
                <div class="row">
                  <div class="col-12 p-0">
                    <comNavbar @go-home="resetData" @search="handleSearch"/>
                  </div>
                </div>

                <div v-if="isLoading" class="w-100 d-flex justify-content-center align-items-center my-2" style="height: 300px;">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else>
                    <!-- Home -->
                    <div v-if="content === ''" >
                          <!-- Top Box Office -->
                          <div class="row my-4">
                            <div class="col-4  mx-auto p-0">
                              <comSlideLarge @movie-detail='loadMovieDetail'/>
                            </div>
                          </div>
                          <!-- Most popular -->
                          <div class="row my-4" style=" position: relative; padding-top: 20px; ">
                            <h3>Most Popular</h3>
                            <div class="col-12 p-2" style=" position: relative;">
                              <comSlideSmall :movies="mostPopularMovies" @movie-detail='loadMovieDetail'/>
                            </div>
                          </div>
                          <!-- Top rating -->
                          <div class="row my-4" style="position: relative; padding-bottom: 20px;">
                          <h3>Top Rating</h3>
                            <div class="col-12 p-2" style=" position: relative; ">
                              <comSlideSmall :movies="topRatingMovies"  @movie-detail='loadMovieDetail'/>
                            </div>
                          </div>

                    </div>

                    <!-- Movie Detail -->
                    <div class="row" v-if="content === 'movieDetail'">
                      <div class="col-12 p-2">
                        <comDetailMovie  @actor-details='loadActorDetail'/>
                      </div>
                    </div>
                    <!-- Actor Detail -->
                    <div class="row" v-if="content === 'actorDetail'">
                      <div class="col-12 p-2">
                        <comDetailActor  />
                      </div>
                      <div class="col-12 p-2">
                        <comListMoviesOfActor  @update-data="loadPage" @movie-detail='loadMovieDetail'/>
                      </div>
                    </div>

                    <!-- Search -->
                    <div class="row" v-if="content === 'search'">
                      <div class="col-12 p-2">
                          <h5 v-if="tempTypeSearch === 'name'">List of movies found by actor name</h5>
                          <h5  v-if="tempTypeSearch === 'movie'">List of movies found by movie title</h5>
                      </div>
                      <div class="col-12 p-2">
                        <comListMovie  @update-data="loadPage" @movie-detail='loadMovieDetail'/>
                      </div>
                    </div>

                </div>

                <!-- Footer -->
                <div class="row my-2 py-2">
                    <div class="col-12 p-0">
                        <comFooter />
                    </div>
                </div>
            </div>
        </div>
      `,
};
