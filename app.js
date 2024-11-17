import {
  comHeader,
  comFooter,
  comNavbar,
  comSlideLarge,
  comSlideSmall,
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
      content: null,
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
    async loadMovieDetail(movieId) {
      try {
        const query = `detail/movie/${movieId}`;
        const data = await dbProvider.fetch(query);
        if (data.detail) {
          this.movie = data.detail;
          this.content = "comDetails";
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error loading movie detail:", error);
      }
    },
    resetDetail() {
      this.movie = {};
      this.content = null;
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
                    <comNavbar />
                  </div>
                </div>

                <!-- Top Box Office -->
                <div class="row my-2">
                  <div class="col-3  mx-auto p-0">
                    <comSlideLarge />
                  </div>
                </div>
                <!-- Most popular -->
                <div class="row my-4" style="overflow: visible; position: relative; padding-top: 20px; ">
                  <h3>Most Popular</h3>
                  <div class="col-12 p-2" style="overflow: visible; position: relative;">
                    <comSlideSmall :movies="mostPopularMovies"/>
                  </div>
                </div>
                <!-- Top rating -->
                <div class="row my-4" style="overflow: visible; position: relative;padding-bottom: 20px;">
                 <h3>Top Rating</h3>
                  <div class="col-12 p-2" style="overflow: visible; position: relative; ">
                    <comSlideSmall :movies="topRatingMovies"/>
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
