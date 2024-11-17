export const comHeader = {
  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    modeIcon() {
      return this.isDarkMode ? "bi-moon-fill" : "bi-sun-fill";
    },
    switchPosition() {
      return this.isDarkMode ? "switch-dark" : "switch-light";
    },
  },
  methods: {
    toggleMode() {
      this.$emit("toggle-mode");
    },
  },
  template: `
          <div class="header d-flex justify-content-between align-items-center p-3">
            <div>&lt;22120393&gt;</div>
            <h2 class="m-0">Movie Info</h2>
            <div class="mode-toggle-container d-flex align-items-center">
              <div :class="['mode-toggle', switchPosition]" @click="toggleMode">
                <div class="switch"></div>
              </div>
              <i :class="['bi', modeIcon]"></i>
            </div>
          </div>
        `,
};

export const comFooter = {
  template: `
            <div class="footer">
                &lt;22120393 - Nguyen Le Thanh Truc&gt;
            </div>
        `,
};

export const comNavbar = {
  template: `
        <nav class="navbar navbar-expand-lg navbar-light rounded" style="background-color: #67abfe80; border: 1px solid blue">
          <div class="container-fluid">
            <a class="navbar-brand" href="/"><i class="bi bi-house-fill"></i></a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent" >
              <form class="d-flex ms-auto">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
    `,
};

export const comSlideLarge = {
  inject: ["topBoxOfficeMovies"],
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  template: `
      <div id="movieCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <!-- Loop through topBoxOfficeMovies and display them -->
          <div v-for="(movie, index) in topBoxOfficeMovies" :key="movie.id" :class="['carousel-item', index === 0 ? 'active' : '']">
            <div class='inner-image'><img :src="movie.image" class="d-block w-100 h-100" :alt="movie.title" /></div>
            <div class="carousel-caption d-none d-md-block">
              <h5>{{ movie.title }}</h5>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
  `,
};

export const comSlideSmall = {
  props: {
    movies: {
      type: Array,
      required: true,
    },
    moviesPerSlide: {
      type: Number,
      default: 3,
    },
    uniqueId: {
      type: String,
      default: () => "carousel-" + Date.now(),
    },
  },
  computed: {
    groupedMovies() {
      const groups = [];
      for (let i = 0; i < this.movies.length; i += this.moviesPerSlide) {
        groups.push(this.movies.slice(i, i + this.moviesPerSlide));
      }
      return groups;
    },
  },
  template: `
    <div :id="uniqueId" class="carousel slide" data-bs-ride="carousel" style="overflow: visible; position: relative;"> 
        <!-- Wrapper for slides -->
        <div class="carousel-inner" style="overflow: visible; position: relative;">
          <div
            v-for="(group, index) in groupedMovies"
            :key="'slide-' + index"
            :class="['carousel-item', { active: index === 0 }]"
          >
              <div class="row">
                <div v-for="movie in group" :key="movie.id" class="col-md-4">
                  <div class="box-movie">
                      <div class="container-image">
                        <img :src="movie.image" class="d-block w-100" :alt="movie.title" />
                      </div>
                      <div class="text-center mt-2 title-movie">{{ movie.title }}</div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <!-- Controls -->
        <button
          class="slideSmall carousel-control-prev"
          type="button"
          :data-bs-target="'#' + uniqueId"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="slideSmall carousel-control-next"
          type="button"
          :data-bs-target="'#' + uniqueId"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
  </div>
  `,
};
