<template>
  <div v-if="podcast" class="flex flex-col space-y-4 p-4 relative">
    <button @click="podcasts.closePodcast()"
            class="absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
      <span class="sr-only">Close</span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    <div class="w-full max-w-2xl mx-auto">
      <img
          :src="`https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2F${podcasts.selectedPodcastId}.png?alt=media`"
          :alt="podcast?.summary"
          class="w-full h-64 object-cover rounded-lg shadow-lg"
      />
    </div>
    <div class="w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-2">{{ podcast?.summary }}</h1>
      <audio
          controls
          class="w-full"
      >
        <source
            :src="`https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-audio%2F${podcasts.selectedPodcastId}.wav?alt=media`"
            type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>
    <div class="w-full max-w-2xl mx-auto space-y-4">
      <div v-for="(message, index) in podcast?.text" :key="index"
           :class="[
             'p-4 rounded-lg max-w-[80%]',
             message.speaker === speakerA ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
           ]">
        {{ message.speaker }}: {{ message.text }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {usePodcastsStore} from "@/stores/podcasts.ts";
import type {Podcast} from '@/types/Podcast';
import {computed, type ComputedRef} from "vue";

const podcasts = usePodcastsStore()
const podcast: ComputedRef<Podcast | undefined> = computed(() => podcasts.podcast)
const speakerA: ComputedRef<string|undefined> = computed(() => podcast.value?.text[0]?.speaker)
// const speakerB: ComputedRef<string|undefined> = computed(() => podcast.value?.text[1]?.speaker)
</script>