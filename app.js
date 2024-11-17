import { comHeader, comFooter, comNavbar } from "./layout.js";

export default {
  data() {
    return { isDarkMode: false };
  },
  components: {
    comHeader,
    comFooter,
    comNavbar,
  },
  computed: {
    modeClass() {
      return this.isDarkMode ? "dark-mode" : "light-mode";
    },
  },
  methods: {
    toggleMode() {
      this.isDarkMode = !this.isDarkMode;
    },
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
