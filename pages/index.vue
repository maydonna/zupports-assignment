<script setup lang="ts">
import { GoogleMap, AdvancedMarker } from "vue3-google-map";
import z from "zod";

const config = useRuntimeConfig();

const state = reactive({
  keyword: "Bang Sue",
  nextPageToken: "",
});
const schema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
});
const selectedRestaurant = ref<Restaurant | null>(null);

const { data, refresh, status } = useFetch<RestaurantResponse>("/restaurants", {
  baseURL: config.public.apiBaseUrl,
  method: "GET",
  query: state,
  watch: false,
  immediate: false,
  onResponse: ({ response }) => {
    if (response.status === 200) {
      state.nextPageToken = response._data.nextPageToken ?? "";
    } else {
      console.error("Failed to fetch restaurants");
    }
  },
});

// Extract the list of restaurants from the fetched data
const restaurants = computed(() => data.value?.data ?? []);

// Computed property to determine the center of the map based on selected restaurant or first restaurant
const center = computed(() => {
  if (selectedRestaurant.value) {
    return {
      lat: selectedRestaurant.value.location.latitude,
      lng: selectedRestaurant.value.location.longitude,
    };
  } else {
    const firstRestaurant = restaurants.value[0];
    return firstRestaurant
      ? {
          lat: firstRestaurant.location.latitude,
          lng: firstRestaurant.location.longitude,
        }
      : { lat: 13.7563, lng: 100.5018 }; // Default to Bangkok if no restaurant found
  }
});

// Computed property to generate markers for the map
const markers = computed(() => {
  return restaurants.value.map((restaurant) => ({
    position: {
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
    },
  }));
});

const onSubmit = async () => {
  //clear the next page token and selected restaurant before fetching new data with the new keyword
  selectedRestaurant.value = null;
  state.nextPageToken = "";
  await refresh();
};

const onSelectRestaurant = (restaurant: Restaurant) => {
  selectedRestaurant.value = restaurant;
};

onBeforeMount(async () => {
  // Initialize data with default keyword
  await refresh();
});
</script>
<template>
  <ClientOnly>
    <div
      class="flex flex-col min-h-screen max-h-screen min-w-screen max-w-screen"
    >
      <!-- Search and result section -->
      <UContainer
        class="lg:absolute lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:z-10 lg:w-1/2 lg:max-w-lg w-full lg:h-11/12 lg:rounded-lg lg:shadow flex-1 px-4 py-8 lg:overflow-hidden bg-default/85 animate-fade-down"
      >
        <!-- Search -->
        <div class="flex flex-col items-center w-full">
          <h1 class="text-xl lg:text-2xl font-bold text-center">
            <span v-gsap.animateText.once.slow>
              What or Where you want to
            </span>
            <span
              v-gsap.delay-2000.animateText.once.slow
              class="text-2xl lg:text-4xl text-primary"
            >
              EAT?
            </span>
          </h1>
          <p
            class="text-center text-sm lg:text-base text-gray-400 font-medium mt-2 animate-delay-[2500ms] animate-fade-down"
          >
            Search for locations, cuisines, or dishes to get your desired
            restaurant
          </p>

          <UForm
            ref="form"
            :schema="schema"
            :state="state"
            class="mt-4 w-full max-w-md animate-delay-[2500ms] animate-fade-down flex items-center space-x-2"
            @submit="onSubmit"
            @keydown.enter="onSubmit"
          >
            <UFormField name="keyword" class="w-full">
              <UInput
                v-model="state.keyword"
                placeholder="Enter a keyword with location, cuisine, or dish"
                size="xl"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" class="lg:hidden" icon="i-lucide-search" />
          </UForm>
        </div>
        <!-- Restaurant List -->
        <div
          class="mt-8 overflow-y-scroll lg:h-[calc(100vh-320px)] hidden-scrollbar"
        >
          <ul>
            <li v-if="status === 'pending'" class="text-center">
              <UIcon
                name="i-lucide-loader-circle"
                class="text-primary shrink-0 w-10 h-10 animate-spin animate-infinite animate-ease-in-out"
              />
            </li>
            <li
              v-else-if="restaurants.length === 0"
              class="text-center text-gray-500"
            >
              No restaurants found
            </li>
            <li
              v-else
              v-for="restaurant in restaurants"
              :key="restaurant.id"
              class="mb-4"
            >
              <RestaurantCard
                :model-value="restaurant"
                class="hover:cursor-pointer"
                @click="onSelectRestaurant(restaurant)"
              />
            </li>
            <li
              v-if="state.nextPageToken && status !== 'pending'"
              class="mt-4 text-center"
            >
              <UButton
                icon="i-lucide-refresh-cw"
                color="neutral"
                variant="ghost"
                :ui="{
                  base: 'hover:cursor-pointer',
                  leadingIcon: 'text-primary',
                }"
                @click="refresh()"
              >
                Find More
              </UButton>
            </li>
          </ul>
        </div>
      </UContainer>
      <!-- Google Map -->
      <GoogleMap
        :api-key="config.public.googleMapsApiKey"
        :map-id="config.public.googleMapsMapId"
        :center="center"
        :zoom="15"
        class="hidden lg:flex w-full h-screen"
      >
        <AdvancedMarker
          v-for="(marker, i) in markers"
          :key="i"
          :options="marker"
        />
      </GoogleMap>
    </div>
  </ClientOnly>
</template>
<style scoped></style>
