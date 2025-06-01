import {defineStore} from "pinia";
import {ref, type Ref} from "vue";
import type {Person} from "../types/Person.ts";
import {usePersonService} from "../services/person.ts";

export const usePersonStore = defineStore("person", () => {
    const person: Ref<Person | undefined> = ref(undefined)
    const loading: Ref<boolean> = ref(false)

    async function load() {
        loading.value = true
        person.value = await usePersonService().getPerson()
        loading.value = false
    }

    return {
        person,
        loading,
        load,
    }
})