<template>
  <div class="mb-6">
    <button @click="showForm = !showForm"
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      <PhPlus v-if="!showForm" :size="20"/>
      <PhX v-else :size="20"/>
      {{ showForm ? 'Cancel' : 'Request New Podcast' }}
    </button>

    <form v-if="showForm" @submit.prevent="" class="mt-4 p-6 bg-white rounded-lg shadow-md">
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
        <select
            id="duration"
            v-model="formData.duration"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="short">Short (5-10 minutes)</option>
          <option value="medium">Medium (10-15 minutes)</option>
          <option value="long">Long (15-20 minutes)</option>
        </select>
      </div>

      <LoadingSpinnerComponent v-if="generatingPodcast"/>
      <button
          v-else
          type="submit"
          @click="generatePodcast"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Generate Podcast
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {PhPlus, PhX} from "@phosphor-icons/vue";
import {type Ref, ref} from "vue";
import {usePodcastsStore} from "@/stores/podcasts.ts";
import {usePodcastsService} from "@/services/podcasts.ts";
import LoadingSpinnerComponent from "@/components/LoadingSpinnerComponent.vue";

const podcasts = usePodcastsStore()
const generatingPodcast: Ref<boolean> = ref(false)
const showForm = ref(false)
const formData = ref({
  topic: '',
  duration: 'short' as 'short' | 'medium' | 'long'
})

const generatePodcast = async () => {
  generatingPodcast.value = true
  await usePodcastsService().createPodcast(formData.value.topic, formData.value.duration)
  showForm.value = false
  formData.value = {topic: '', duration: 'short'}
}
</script>