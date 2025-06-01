<template>
  <div class="h-screen w-screen flex flex-col">
    <div class="flex flex-row justify-between items-center overflow-hidden
                px-12 min-h-16 max-h-16 py-3
                border-b border-app-500/30">
      <div class="flex flex-row h-full items-center">
        <img src="/logo.png" class="h-full"/>
        <span class="font-semibold ml-3">Dr. Llamahattan</span>
      </div>
      <ViewToggleComponent v-model="view"/>
      <div @click="()=>app.showUserPicker = true"
           class="flex flex-row items-center gap-x-1">
        <PhUser/>
        <span>{{ app.activeUserId }}</span>
      </div>
    </div>
    <PersonsComponent v-if="app.showUserPicker"/>
    <PodcastsComponent v-else-if="view === AppView.Podcasts"/>
    <RecorderComponent v-else-if="view === AppView.Recorder"/>
    <MeComponent v-else/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, type Ref, watch} from "vue";
import PodcastsComponent from "./components/PodcastsComponent.vue";
import {AppView} from "./types/AppView.ts";
import ViewToggleComponent from "./components/ViewToggleComponent.vue";
import RecorderComponent from "@/components/RecorderComponent.vue";
import MeComponent from "@/components/me/MeComponent.vue";
import {usePersonStore} from "@/stores/person.ts";
import {PhUser} from "@phosphor-icons/vue";
import {useAppStore} from "@/stores/app.ts";
import PersonsComponent from "@/components/persons/PersonsComponent.vue";

const person = usePersonStore()
const app = useAppStore()
const view: Ref<AppView> = ref(localStorage.getItem("view") as AppView | undefined || AppView.Podcasts);
const userId = ref(localStorage.getItem("userId") || "default");

watch(() => view.value, () => {
  console.log("watch")
  localStorage.setItem("view", view.value)
})

const updateUserId = () => {
  localStorage.setItem("userId", userId.value);
}

onMounted(() => person.load())
</script>