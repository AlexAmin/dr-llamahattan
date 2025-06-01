<template>
  <div class="h-screen w-screen flex flex-col">
    <ViewToggleComponent v-model="view"/>
    <PodcastsComponent v-if="view === AppView.Podcasts"/>
    <RecorderComponent v-else-if="view === AppView.Recorder"/>
  </div>
</template>

<script setup lang="ts">
import {ref, type Ref, watch} from "vue";
import PodcastsComponent from "./components/PodcastsComponent.vue";
import {AppView} from "./types/AppView.ts";
import ViewToggleComponent from "./components/ViewToggleComponent.vue";
import RecorderComponent from "@/components/RecorderComponent.vue";

const view: Ref<AppView> = ref(localStorage.getItem("view") as AppView | undefined || AppView.Podcasts);

watch(() => view.value, () => {
  console.log("watch")
  localStorage.setItem("view", view.value)
})
</script>