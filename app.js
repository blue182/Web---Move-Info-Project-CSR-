import {
  comHeader,
  comFooter,
  comNavbar,
  comSlideLarge,
  comSlideSmall,
  comDetailMovie,
  comDetailActor,
  slideImage,
} from "./layout.js";
import { DBProvider } from "./moduleProvider.js";
import { computed } from "vue";

const dbProvider = new DBProvider();

export default {
  data() {
    return {
      isDarkMode: false,
      page: 1,
      per_page: 10,
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
    };
  },
  methods: {
    toggleMode() {
      this.isDarkMode = !this.isDarkMode;
    },

    async loadMovies(page = 1) {
      try {
        const query = `movie/movie/?page=${page}&per_page=${this.per_page}`;
        const data = await dbProvider.fetch(query);
        this.movies = data.items;
        this.page = data.page;
        this.total_pages = data.total_page;
        console.log(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    },
    async loadListMovieOfActor(page = 1, actorId) {
      console.log("actor id: ", actorId);
      try {
        const query = `movie/actor-movies/${actorId}?page=${page}&per_page=${this.per_page}`;
        const data = await dbProvider.fetch(query);
        this.listMovieOfActor = data.items;
        this.page = data.page;
        this.total_pages = data.total_page;
        console.log("List Movie Of actor: ", data);
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
        console.log(data);
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
        console.log(data);
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
        console.log(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
      this.isLoading = false;
    },

    async loadDataHome() {
      this.loadTopBoxOffice();
      this.loadMostPopularMovies();
      this.loadTopRating();
      this.isLoading = false;
    },

    async loadActorDetail(actorId) {
      this.isLoading = true;
      console.log("ActorID: ", actorId);
      try {
        const query = `detail/name/${actorId}`;

        const data = await dbProvider.fetch(query);
        console.log("Detail Actor: ", data);
        if (data.detail) {
          this.actor = data.detail;
          this.content = "actorDetail";
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error loading movie detail:", error);
      }
      this.loadListMovieOfActor(1, actorId);
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
      try {
        const query = `detail/movie/${movieId}`;
        const data = await dbProvider.fetch(query);
        if (data.detail) {
          this.movie = data.detail;
          this.content = "movieDetail";
          this.loadReview(movieId);
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
      (this.actor = {}), (this.reviews = []), (this.content = "");
    },
  },
  mounted() {
    setTimeout(() => {
      this.loadDataHome();
    }, 300);
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
                    <comNavbar @go-home="resetData" />
                  </div>
                </div>

                <div v-if="isLoading" class="h-100 d-flex justify-content-center align-items-center my-2">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else>
                    <!-- Home -->
                    <div v-if="content === ''" >
                          <!-- Top Box Office -->
                          <div class="row my-4">
                            <div class="col-3  mx-auto p-0">
                              <comSlideLarge @movie-detail='loadMovieDetail'/>
                            </div>
                          </div>
                          <!-- Most popular -->
                          <div class="row my-4" style="overflow: visible; position: relative; padding-top: 20px; ">
                            <h3>Most Popular</h3>
                            <div class="col-12 p-2" style="overflow: visible; position: relative;">
                              <comSlideSmall :movies="mostPopularMovies" @movie-detail='loadMovieDetail'/>
                            </div>
                          </div>
                          <!-- Top rating -->
                          <div class="row my-4" style="overflow: visible; position: relative;padding-bottom: 20px;">
                          <h3>Top Rating</h3>
                            <div class="col-12 p-2" style="overflow: visible; position: relative; ">
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
