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
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    goHome() {
      this.$emit("go-home");
    },
    handleSearch(searchType) {
      if (this.searchQuery.trim()) {
        this.$emit("search", {
          query: this.searchQuery.trim(),
          type: searchType,
        });
      }
    },
    preventEnter(event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    },
  },
  template: `
        <nav class="navbar navbar-expand-lg navbar-light rounded" style="background-color: #67abfe80; border: 1px solid blue">
          <div class="container-fluid">
            <button class="navbar-brand" @click="goHome" style="border: none; background: transparent;">
              <i class="bi bi-house-fill">
            </i></button>
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
              <form class="d-flex ms-auto " @submit.prevent>
                <input class="form-control me-2" type="search" placeholder="Search" v-model="searchQuery" aria-label="Search">
                <button class="btn btn-outline-success me-2 text-nowrap" type="button" @click="handleSearch('movie')">Search by Title</button>
                <button class="btn btn-outline-success text-nowrap" type="button" @click="handleSearch('name')">Search by Actor</button>
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
  methods: {
    movieDetail(id) {
      this.$emit("movieDetail", id);
    },
  },
  mounted() {},
  template: `
      <div id="movieCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <!-- Loop through topBoxOfficeMovies and display them -->
          <div v-for="(movie, index) in topBoxOfficeMovies" :key="movie.id" @click="movieDetail(movie.id)" :class="['carousel-item', index === 0 ? 'active' : '']">
            <div class='inner-image'>          
                <img :src="(movie.posters && movie.posters.length > 0) ? movie.posters[2].link : movie.image" 
                  class="d-block w-100 h-100" 
                :alt="movie.title" />
            </div>
            <div class="carousel-caption d-none d-md-block" style="background-color: rgba(0, 0, 0, 0.767); padding: 0px" >
              <div style="font-size: 1.2rem; color: rgb(251, 206, 28);">{{ movie.title }}</div>
              <div style="font-size: 0.9rem"> 
                <div>Length: {{ movie.runtimeStr }}</div>
                <div>Rating from IMDb: {{ movie.ratings.imDb }}</div>
              </div>
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
  methods: {
    movieDetail(id) {
      this.$emit("movieDetail", id);
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
                <div v-for="movie in group" :key="movie.id" @click="movieDetail(movie.id)" class="col-md-4 h-100">
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

export const slideImage = {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  template: `
        <div id="carouselExample" class="carousel slide"  data-bs-ride="carousel" data-bs-interval="3000" >
            <!-- Slides -->
            <div class="carousel-inner" style="height: 400px;">
              <div
                class="carousel-item"
                v-for="(image, index) in images"
                :key="index"
                :class="{ active: index === 0 }"
              >
                <img :src="image.image" class="d-block w-100" alt="Slide Image" 
                  style="height: 100%; object-fit: cover; width: 100%;" />
              </div>
            </div>

            <!-- Controls -->
            <button
              class="carousel-control-prev"
              style="left: -15%;"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              style="right: -15%;"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
      </div>
  
  `,
};
export const comDetailMovie = {
  inject: ["movie", "reviews"],
  data() {
    return {
      visibleReviewsCount: 5,
    };
  },
  emits: ["actor-details"],
  methods: {
    actorDetail(id) {
      this.$emit("actor-details", id);
    },
    toggleContent(index) {
      this.reviews[index].collapsedReviews =
        !this.reviews[index].collapsedReviews;
    },

    showMoreReviews() {
      this.visibleReviewsCount = this.reviews.length;
    },
  },
  computed: {
    visibleReviews() {
      return this.reviews.slice(0, this.visibleReviewsCount);
    },
  },
  components: {
    slideImage,
  },
  template: `

        <div class='row'>
            <div class="col-md-5 d-flex align-items-center justify-content-center text-center p-3">
              <div style="width: 90%;"> 
                <img :src="(movie.posters && movie.posters.length > 0) ? movie.posters[2].link : movie.image" alt="Poster Movie" class="img-fluid rounded">
              </div>
            </div>
            <div class="col-md-7 p-4 d-flex flex-column justify-content-center">
              <h1 style="text-align: center; margin-bottom: 50px; color: #FF9658">{{ movie.fullTitle }}</h1>

              <div class='row w-100 d-flex align-items-center justify-content-center p-1'>
                  <div class="col-md-4">
                    <p><strong>Type: </strong> {{movie.type}}</p>
                  </div>
                  <div class="col-md-8">
                      <p><strong>Genre:</strong>       
                        {{ movie.genreList && Array.isArray(movie.genreList) && movie.genreList.length > 0 
                        ? movie.genreList.map(genre => genre.value).join(', ')  : 'N/A' }}          
                    </p>
                  </div>
              
              </div>
              <div class='row w-100 d-flex align-items-center justify-content-center p-1'>
                  <div class="col-md-4">
                    <p><strong>Product year:</strong> {{ movie.year }}</p>
                  </div>
                  <div class="col-md-8">
                      <p><strong>Release Date: </strong> {{movie.releaseDate}}</p> 
                  </div>
              
              </div> 
              <p><strong>Awards: </strong> {{movie.awards}}</p> 
              <p><strong>Companies: </strong> {{movie.companies}}</p> 
              <p><strong>Director:</strong>       
                    {{ movie.directorList && Array.isArray(movie.directorList) && movie.directorList.length > 0 
                      ? movie.directorList.map(director => director.name).join(', ') : 'N/A' }}
              </p>
              <p><strong>Actors: </strong>           
                <span v-for="(actor, index) in movie.actorList" :key="actor.id">
                  <span @click="actorDetail(actor.id)" style="cursor: pointer; color: #007bff;">{{ actor.name }}</span>
                  <span v-if="index < movie.actorList.length - 1">, </span>
                </span>
              </p> 
              <h5>Summary:</h5>
              <p>{{ movie.plot }}</p>
            </div>
        </div>


        <div class='row d-flex align-items-center justify-content-center'>

        
        </div>
        <div class='row d-flex align-items-center justify-content-center'>
            <div class="col-md-9 p-3">
               <slideImage :images="movie.images" />
            </div>
        
        </div>

        <div v-if="reviews.length > 0" class='row d-flex align-items-center justify-content-center'>
        
          <div class="col-md-11 p-3">
              <h5 style="margin-bottom: 20px;">Reviews</h5>
              <!-- Review Section -->
              <div  v-for="(review, index) in visibleReviews" :key="review.username" class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">{{ review.title }}</h5>
                  <!-- Content review -->
                  <p class="card-text" :class="{ 'd-none': review.collapsedReviews }">
                    {{ review.content }}
                  </p>

                  <!-- Button See More/See Less -->
                  <button v-if="review.content.length > 100" @click="toggleContent(index)" class="btn btn-link">
                    {{ review.collapsedReviews ? 'See More' : 'See Less' }}
                  </button>
                  <div class="d-flex justify-content-between">
                    <span class="text-muted">By: {{ review.username }}</span>
                    <span class="badge" :style="{ backgroundColor: '#f8f9fa', color: '#6c757d' }">{{ '⭐'.repeat(review.rate) }}</span>
                  </div>
                  <p class="text-muted">{{ review.date }}</p>
                  <div v-if="review.warningSpoilers" class="alert alert-danger">
                    ⚠️ Spoilers Ahead!
                  </div>
                </div>
              </div>
              <button v-if="reviews.length > visibleReviews.length" @click="showMoreReviews" class="btn btn-primary">
                  Show More
              </button>
          </div>
        
        </div>

  
  `,
};

export const comDetailActor = {
  inject: ["actor"],
  data() {
    return {};
  },
  methods: {},
  template: `
        <div class='row'>
            <div class="col-md-5 d-flex align-items-center justify-content-center text-center p-3">
              <div style="width: 80%;"> 
                <img :src="actor.image" alt="Image Actor" class="img-fluid rounded" style="max-height: 500px; object-fit: cover; width: 100%;">
              </div>
            </div>
            <div class="col-md-7 p-4 d-flex flex-column justify-content-center">
              <h2 style="text-align: center; margin-bottom: 70px;">{{ actor.name }}</h2>
              <p><strong>Birthday:</strong> {{ actor.birthDate }}</p>
              <p v-if="actor.deathDate"><strong>Death Date:</strong> {{ actor.deathDate }}</p>
              <p><strong>Height:</strong> {{ actor.height }}</p>
              <p><strong>Role:</strong> {{ actor.role }}</p>
              <p><strong>Awards:</strong> {{ actor.awards }}</p>
              <p><strong>Summary:</strong> {{ actor.summary }}</p>

          </div>
        </div>
  `,
};

export const comListMovie = {
  inject: ["dataSearch", "page", "total_pages"],
  methods: {
    updateData(page) {
      this.$emit("updateData", page);
    },
    movieDetail(id) {
      this.$emit("movieDetail", id);
    },
  },
  template: `
      <div v-if="dataSearch.length > 0" class="movie-list-container mt-2">
        <div class="row row-cols-1 row-cols-md-3 g-5">
          <div v-for="movie in dataSearch" :key="movie.id" @click="movieDetail(movie.id)" class="col">
            <div class="movie-card h-100">
              <div class="movie-poster-container">
                <div class="poster-wrapper">
                  <img
                    :src="(movie.posters && movie.posters.length > 0) ? movie.posters[2].link : movie.image"
                    alt="Movie Poster"
                    class="movie-poster"
                  />
                </div>
                <div class="movie-info">
                  <h5 class="movie-title">{{ movie.title }}</h5>
                  <p style="color: #b6b0b0; text-align: center;  width: 100%;"> [           
                        {{ movie.genreList && Array.isArray(movie.genreList) && movie.genreList.length > 0 
                        ? movie.genreList.map(genre => genre.value).join(', ')  : 'N/A' }} ]        
                  </p>
                  <p><strong>Rated:</strong> {{ movie.ratings.imDb }}</p>
                  <p><strong>Length:</strong> {{ movie.runtimeStr }}</p>
                  <p><strong>Language:</strong> {{ movie.languages }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-controls d-flex align-items-center justify-content-center mt-4" >
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: page === 1}">
                    <a class="page-link" href="#" @click.prevent="updateData(page -1)" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                <li class="page-item" v-for="i in total_pages">
                    <a :class="{ 'page-link': true, 'active': i === page }" href="#" @click.prevent="updateData(i)">{{i}}</a>
                </li>
                <li class="page-item" :class="{ disabled: page === total_pages}">
                    <a class="page-link" href="#" @click.prevent="updateData(page  + 1)" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </div>
      </div>
      <div v-if="dataSearch.length === 0" class="movie-list-container mt-2">
          <h5>Not found movie.</h5>     
      </div>
  `,
};
export const comListMoviesOfActor = {
  inject: ["listMovieOfActor", "page", "total_pages"],
  methods: {
    updateData(page) {
      this.$emit("updateData", page);
    },
    movieDetail(id) {
      this.$emit("movieDetail", id);
    },
  },
  template: `
      <div v-if="listMovieOfActor.length > 0" class="movie-list-container mt-2">
        <h4 class="border-bottom pb-2 mb-3">List of movies participated</h4>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-6 g-4">

          <div 
            v-for="movie in listMovieOfActor" 
            :key="movie.id" 
            @click="movieDetail(movie.id)" 
            class="col"
          >
            <div class="movie-card h-100">
              <div class="movie-poster-container">
                <div class="poster-wrapper">
                  <img
                    :src="(movie.posters && movie.posters.length > 0) ? movie.posters[0].link : movie.image"
                    alt="Movie Poster"
                    class="movie-poster"
                  />
                </div>
                <div class="actorlist-movie-info">
                  <div class="actorlist-movie-title">{{ movie.title }}</div>
                  <p style="color: #b6b0b0; text-align: center;  width: 100%;"> [           
                        {{ movie.genreList && Array.isArray(movie.genreList) && movie.genreList.length > 0 
                        ? movie.genreList.map(genre => genre.value).join(', ')  : 'N/A' }} ]        
                  </p>
                  <p><strong>Rated:</strong> {{ movie.ratings.imDb }}</p>
                  <p><strong>Length:</strong> {{ movie.runtimeStr }}</p>
                  <p><strong>Language:</strong> {{ movie.languages }}</p>
                  <p><strong>Role:</strong> {{ movie.roleOfActor }}</p>
                  <p><strong>Release Date: </strong> {{movie.releaseDate}}</p> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-controls d-flex align-items-center justify-content-center mt-4" >
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: page === 1}">
                    <a class="page-link" href="#" @click.prevent="updateData(page -1)" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                <li class="page-item" v-for="i in total_pages">
                    <a :class="{ 'page-link': true, 'active': i === page }" href="#" @click.prevent="updateData(i)">{{i}}</a>
                </li>
                <li class="page-item" :class="{ disabled: page === total_pages}">
                    <a class="page-link" href="#" @click.prevent="updateData(page  + 1)" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </div>
      </div>
  `,
};
