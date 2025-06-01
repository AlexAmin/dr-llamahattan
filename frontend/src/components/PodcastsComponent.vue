<template>
  <div class="container mx-auto px-4 py-8">
    <NewPodcastFormComponent/>
    <div v-if="podcasts.loading" class="flex justify-center items-center min-h-[200px]">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-transparent"></div>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PodcastsListComponent/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {usePodcastsStore} from "../stores/podcasts.ts";
import {onMounted} from "vue";
import PodcastsListComponent from "./podcasts/PodcastsListComponent.vue";
import NewPodcastFormComponent from "@/components/podcasts/NewPodcastFormComponent.vue";

const podcasts = usePodcastsStore()

onMounted(() => {
  if (podcasts.podcasts.length === 0) podcasts.load()
})
</script>