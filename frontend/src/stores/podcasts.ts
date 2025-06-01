import {defineStore} from "pinia";
import {usePodcastsService} from "../services/podcasts.ts";
import {ref, type Ref} from "vue";
import type {PodcastSummary} from "../types/Podcast.ts";

export const usePodcastsStore = defineStore("podcasts", () => {
    const podcasts: Ref<PodcastSummary[]> = ref([])
    const loading: Ref<boolean> = ref(false)

    async function load() {
        loading.value = true
        podcasts.value = await usePodcastsService().getPodcasts()
        loading.value = false
    }

    return {
        podcasts,
        loading,
        load,
    }
})