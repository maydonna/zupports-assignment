<script setup lang="ts">
import { GoogleMap, MarkerCluster, AdvancedMarker } from "vue3-google-map";
import z from "zod";

const config = useRuntimeConfig();

const state = reactive({
  keyword: "Bang Sue",
});

const schema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
});

const { data, status, error, refresh } = await useFetch(
  config.public.apiBaseUrl + "/restaurants",
  {
    method: "GET",
    query: {
      keyword: state.keyword.trim(),
    },
    immediate: false,
  }
);

const restaurants = computed(() => data.value?.data ?? []);
const center = computed(() => {
  const firstRestaurant = restaurants.value[0];
  return firstRestaurant
    ? {
        lat: firstRestaurant.location.latitude,
        lng: firstRestaurant.location.longitude,
      }
    : { lat: 13.7563, lng: 100.5018 }; // Default to Bangkok if no restaurant found
});
const markers = computed(() => {
  return restaurants.value.map((restaurant) => ({
    position: {
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
    },
  }));
});

const onSubmit = async () => {
  await refresh();
};

onBeforeMount(async () => {
  await refresh();
  console.log(data.value);
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
        <div class="mt-8 overflow-y-scroll lg:h-[calc(100vh-320px)]">
          <UCard v-if="restaurants && restaurants.length > 0">
            <h2 class="text-lg font-semibold mb-4">Search Results</h2>
            <ul class="space-y-4">
              <li
                v-for="restaurant in restaurants"
                :key="restaurant.id"
                class="border-b pb-2"
              >
                <h3 class="text-md font-bold">
                  {{ restaurant.displayName.text }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ restaurant.formattedAddress }}
                </p>
              </li>
            </ul>
          </UCard>
          <UCard v-else-if="status === 'pending'" class="p-4">
            <p>Loading...</p>
          </UCard>
          <UCard v-else-if="error" class="p-4 bg-red-100 text-red-800">
            <p>Error: {{ error.message }}</p>
          </UCard>
        </div>
      </UContainer>
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
