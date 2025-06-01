import apiClient from "../apiClient.ts";
import type {Podcast, PodcastSummary, PodcastText} from "../types/Podcast.ts";

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

    async function getPodcast(id: string): Promise<Podcast | undefined> {
        try {
            const response = await apiClient.get<Podcast>("/podcasts/" + id);
            return response.data;
        } catch (error) {
            console.error("Error fetching podcasts:", error);
            return undefined
        }
    }

    async function deletePodcast(id: string) {
        try {
            await apiClient.delete("/podcasts/" + id);
        } catch (error) {
            console.error("Error deleting podcasts:", error);
        }
    }

    async function createPodcast(language: string, topic: string, duration: string) {
        const response = await apiClient.post<PodcastText[]>("/podcasts", {language, topic, duration})
        return response.data;
    }

    return {
        deletePodcast,
        getPodcast,
        getPodcasts,
        createPodcast
    }
}