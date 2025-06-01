<template>
  <div v-for="podcast in podcasts.podcasts"
       :key="podcast.id"
       class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
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
import {onMounted} from "vue";

const podcasts = usePodcastsStore()

onMounted(() => {
  if (podcasts.podcasts.length === 0) podcasts.load()
})
</script>