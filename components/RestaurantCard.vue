<script lang="ts" setup>
const restaurant = defineModel<Restaurant>({
  required: true,
  default: () => ({}),
});

const onOpenOnGoogleMap = () => {
  const url = restaurant.value.google_maps_uri;
  window.open(url, "_blank");
};
</script>

<template>
  <UCard class="relative w-full animate-fade-down bg-gray-800 lg:bg-default">
    <UButton class="absolute top-2 right-2 hover:cursor-pointer" variant="ghost" @click="onOpenOnGoogleMap">
      <UIcon name="i-lucide-map" class="text-primary w-5 h-5" />
    </UButton>
    <div class="flex flex-col">
      <h2 class="text-lg font-semibold mb-4">
        {{ restaurant.name }}
      </h2>
      <p class="text-gray-400 mb-1 text-sm inline-flex items-start">
        <UIcon name="i-lucide-map-pin" class="shrink-0 mr-1 mt-0.5" />
        {{ restaurant.address }}
      </p>
      <p
        v-if="restaurant.phone"
        class="text-gray-400 mb-4 text-sm inline-flex items-start"
      >
        <UIcon name="i-lucide-phone" class="shrink-0 mr-1 mt-0.5" />
        {{ restaurant.phone }}
      </p>
      <div class="flex items-center gap-2">
        <UBadge v-if="restaurant.rating" variant="subtle">
          <div class="inline-flex items-center gap-x-1">
            <UIcon name="i-tabler-star-filled" class="text-yellow-500 w-4" />
            <span>{{ restaurant.rating }}</span>
            <span v-if="restaurant.rating_count" class="text-gray-500">
              ({{ restaurant.rating_count }})
            </span>
          </div>
        </UBadge>
        <UBadge v-if="restaurant.cuisine" variant="subtle">
          {{ restaurant.cuisine }}
        </UBadge>
        <UBadge v-if="restaurant.price_range" variant="subtle">
          {{ restaurant.price_range }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>

<style></style>
