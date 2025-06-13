export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css", "~/assets/css/scrollbar.css"],

  modules: ["@nuxt/ui", "v-gsap-nuxt"],

  vite: {
    server: {
      allowedHosts: [process.env.VITE_ALLOWED_HOST || "localhost"],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "https://localhost:3000/api",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      googleMapsMapId: process.env.GOOGLE_MAPS_MAP_ID || "",
    },
  },

  build: {
    transpile: ["vue3-google-map"],
  },
});
