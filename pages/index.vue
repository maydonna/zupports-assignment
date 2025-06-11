<script setup lang="ts">
import z from 'zod'

const config = useRuntimeConfig()

const state = reactive({
    keyword: 'Bang Sue'
})

const schema = z.object({
    keyword: z.string().min(1, 'Keyword is required')
})

const { data, status, error, refresh } = await useFetch(config.public.apiBaseUrl + '/restaurants', {
    method: 'GET',
    query: {
        keyword: state.keyword.trim()
    },
    immediate: false,
    //transform: (response) => {
    //    return response?.data ?? []
    //},
})

const restaurants = computed(() => data.value?.data ?? [])

const onSubmit = async () => {
    await refresh()
}

onBeforeMount(async () => {
    await refresh()
    console.log(data.value)
})
</script>
<template>
    <ClientOnly>
      <div class="flex flex-col items-center w-full">
            <h1 class="text-xl lg:text-2xl font-bold">
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
            <p class="text-center text-sm lg:text-base text-gray-500 font-semibold mt-2 animate-delay-[2500ms] animate-fade-down">
                Search for locations, cuisines, or dishes to get your desired restaurant
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
                        class="w-full"
                    />
                </UFormField>
                <UButton 
                    type="submit" 
                    class="lg:hidden"
                    icon="i-lucide-search"
                />
            </UForm>
        </div>
    </ClientOnly>

    <UContainer class="mx-auto w-full max-w-4xl mt-8">
        <UCard v-if="restaurants && restaurants.length > 0" class="p-4">
            <h2 class="text-lg font-semibold mb-4">Search Results</h2>
            <ul class="space-y-4">
                <li v-for="restaurant in restaurants" :key="restaurant.id" class="border-b pb-2">
                    <h3 class="text-md font-bold">{{ restaurant.displayName.text }}</h3>
                    <p class="text-sm text-gray-600">{{ restaurant.formattedAddress }}</p>
                </li>
            </ul>
        </UCard>
        <UCard v-else-if="status === 'pending'" class="p-4">
            <p>Loading...</p>
        </UCard>
        <UCard v-else-if="error" class="p-4 bg-red-100 text-red-800">
            <p>Error: {{ error.message }}</p>
        </UCard>
    </UContainer>
</template>
<style scoped>

</style>