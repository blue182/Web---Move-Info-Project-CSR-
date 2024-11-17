import { comHeader, comFooter, comNavbar, comSlideLarge } from "./layout.js";
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
    };
  },
  provide() {
    return {
      movies: computed(() => this.movies),
      page: computed(() => this.page),
      total_pages: computed(() => this.total_pages),
      movie: computed(() => this.movie),
      topBoxOfficeMovies: computed(() => this.topBoxOfficeMovies),
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
        const query = `movie/topboxoffice/?per_page=5&page=1}`;
        const data = await dbProvider.fetch(query);
        this.topBoxOfficeMovies = data.items;
        console.log(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    },

    async loadDataHome() {
      this.loadTopBoxOffice();
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
