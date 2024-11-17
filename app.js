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
    };
  },
  provide() {
    return {
      movies: computed(() => this.movies),
      page: computed(() => this.page),
      total_pages: computed(() => this.total_pages),
      movie: computed(() => this.movie),
      actor: computed(() => this.actor),
      topBoxOfficeMovies: computed(() => this.topBoxOfficeMovies),
      mostPopularMovies: computed(() => this.mostPopularMovies),
      topRatingMovies: computed(() => this.topRatingMovies),
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
    async loadTopBoxOffice() {
      try {
        const query = `movie/topboxoffice/?per_page=5&page=1`;
        const data = await dbProvider.fetch(query);
        this.topBoxOfficeMovies = data.items;
        console.log(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    },
    async loadMostPopularMovies() {
      try {
        const query = `get/mostpopular/?per_page=20&page=1`;
        const data = await dbProvider.fetch(query);
        this.mostPopularMovies = data.items;
        console.log(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    },
    async loadTopRating() {
      try {
        const query = `get/top50/?per_page=20&page=1`;
        const data = await dbProvider.fetch(query);
        this.topRatingMovies = data.items;
        console.log(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    },

    async loadDataHome() {
      this.loadTopBoxOffice();
      this.loadMostPopularMovies();
      this.loadTopRating();
    },
    async loadActorDetail(actorId) {
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
    },
    async loadMovieDetail(movieId) {
      try {
        const query = `detail/movie/${movieId}`;
        const data = await dbProvider.fetch(query);
        console.log("Detail Movie: ", data);
        if (data.detail) {
          this.movie = data.detail;
          this.content = "movieDetail";
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error loading movie detail:", error);
      }
    },
    resetData() {
      this.movie = {};
      this.content = "";
    },
  },
  mounted() {
    this.loadDataHome();
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
