import  VueGoogleMaps from '@fawmi/vue-google-maps'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyDxE6qjpEjja2ZxKlILMG4y4fwlVq_jCb8',
    },
  })
})