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
