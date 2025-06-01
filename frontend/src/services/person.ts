import apiClient from "../apiClient.ts";
import type {Podcast} from "../types/Podcast.ts";
import type {Person} from "../types/Person.ts";

export const usePersonService = () => {

    async function getPerson(): Promise<Person | undefined> {
        try {
            const response = await apiClient.get<Person>("/person")
            return response.data;
        } catch (error) {
            console.error("Error fetching person:", error);
            return undefined
        }
    }

    return {
        getPerson
    }
}