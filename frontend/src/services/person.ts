import apiClient from "../apiClient.ts";
import type {Person, PersonItem} from "../types/Person.ts";

export const usePersonService = () => {

    async function getPerson(): Promise<Person | undefined> {
        try {
            const response = await apiClient.get<Person>("/persons/me")
            return response.data;
        } catch (error) {
            console.error("Error fetching person:", error);
            return undefined
        }
    }

    async function getPersons(): Promise<PersonItem[]> {
        try {
            const response = await apiClient.get<PersonItem[]>("/persons")
            return response.data;
        } catch (error) {
            console.error("Error fetching person:", error);
            return []
        }
    }

    async function createPerson() {
        await apiClient.post("/persons")
    }


    async function deletePerson(id: string) {
        await apiClient.delete("/persons/"+id)
    }
    return {
        deletePerson,
        createPerson,
        getPersons,
        getPerson
    }
}