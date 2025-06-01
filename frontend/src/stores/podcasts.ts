import {defineStore} from "pinia";
import {usePodcastsService} from "../services/podcasts.ts";
import {ref, type Ref} from "vue";
import type {Podcast, PodcastSummary} from "../types/Podcast.ts";

export const usePodcastsStore = defineStore("podcasts", () => {
    const podcasts: Ref<PodcastSummary[]> = ref([])
    const podcast: Ref<Podcast | undefined> = ref(undefined)
    const selectedPodcastId: Ref<string | undefined> = ref(undefined)
    const loadingPodcast: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)
    const loadingDelete: Ref<string | undefined> = ref(undefined)

    async function deletePodcast(podcast: PodcastSummary) {
        loadingDelete.value = podcast.id
        await usePodcastsService().deletePodcast(podcast.id)
        await load()
        loadingDelete.value = undefined
    }

    async function load() {
        loading.value = true
        podcasts.value = await usePodcastsService().getPodcasts()
        loading.value = false
    }

    function closePodcast(){
        selectedPodcastId.value = undefined
        podcast.value = undefined
    }
    return {
        closePodcast,
        selectedPodcastId,
        loadingDelete,
        deletePodcast,
        loadingPodcast,
        podcast,
        podcasts,
        loading,
        load,
    }
})