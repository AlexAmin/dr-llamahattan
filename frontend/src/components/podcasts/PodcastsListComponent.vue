<template>
  <div v-for="podcast in podcasts.podcasts"
       :key="podcast.id"
       class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg duration-300 relative cursor-pointer hover:scale-[101%] transition-all"
       @click="()=>open(podcast)"
  >
    <div v-if="podcasts.loadingDelete === podcast.id"
         class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
      <LoadingSpinnerComponent/>
    </div>
    <button class="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 z-20"
            @click.stop="()=>podcasts.deletePodcast(podcast)">
      <PhTrash class="w-5 h-5 text-gray-600 hover:text-red-600"/>
    </button>
    <div class="aspect-video relative">
      <img
          class="w-full h-full object-cover"
          :src="`https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2F${podcast.id}.png?alt=media`"
          alt="Podcast cover"
      />
    </div>
    <div class="p-4">
      <p class="text-gray-700 text-sm line-clamp-3">{{ podcast.summary }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {usePodcastsStore} from "@/stores/podcasts.ts";
import type {PodcastSummary} from "@/types/Podcast.ts";
import {usePodcastsService} from "@/services/podcasts.ts";
import {PhTrash} from "@phosphor-icons/vue";
import LoadingSpinnerComponent from "@/components/LoadingSpinnerComponent.vue";

const podcasts = usePodcastsStore()

async function open(podcast: PodcastSummary) {
  podcasts.loadingPodcast = true
  podcasts.podcast = await usePodcastsService().getPodcast(podcast.id)
  podcasts.selectedPodcastId = podcast.id
  podcasts.loadingPodcast = false
}
</script>