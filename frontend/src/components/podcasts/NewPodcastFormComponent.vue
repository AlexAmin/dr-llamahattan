<template>
  <div class="mb-6">
    <button @click="showForm = !showForm"
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      <PhPlus v-if="!showForm" :size="20"/>
      <PhX v-else :size="20"/>
      {{ showForm ? 'Cancel' : 'Request New Podcast' }}
    </button>

    <form v-if="showForm" @submit.prevent="handleSubmit" class="mt-4 p-6 bg-white rounded-lg shadow-md">
      <div class="mb-4">
        <label for="topic" class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
        <input
            type="text"
            id="topic"
            v-model="formData.topic"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter podcast topic"
        >
      </div>

      <div class="mb-4">
        <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
          Duration (minutes): {{ formData.duration }}
        </label>
        <input
            type="range"
            id="duration"
            v-model="formData.duration"
            min="5"
            max="20"
            step="1"
            class="w-full"
        >
      </div>

      <button type="submit"
              @click="generatePodcast"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Generate Podcast
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {PhPlus, PhX} from "@phosphor-icons/vue";
import {ref} from "vue";
import {usePodcastsStore} from "@/stores/podcasts.ts";
import {usePodcastsService} from "@/services/podcasts.ts";

const podcasts = usePodcastsStore()
const showForm = ref(false)
const formData = ref({
  topic: '',
  duration: 10
})

const generatePodcast = async () => {
  await usePodcastsService().createPodcast(formData.value)
  showForm.value = false
  formData.value = {topic: '', duration: 10}
}
</script>