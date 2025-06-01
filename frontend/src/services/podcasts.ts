import apiClient from "../apiClient.ts";
import type {PodcastSummary, PodcastText} from "../types/Podcast.ts";

export const usePodcastsService = () => {
    async function getPodcasts(): Promise<PodcastSummary[]> {
        try {
            const response = await apiClient.get<PodcastSummary[]>("/podcasts");
            return response.data;
        } catch (error) {
            console.error("Error fetching podcasts:", error);
            return [];
        }
    }

    async function createPodcast(topic: string, duration: number) {
        const response = await apiClient.post<PodcastText[]>("/podcasts", {topic, duration})
        return response.data;
    }

    return {
        getPodcasts,
        createPodcast
    }
}