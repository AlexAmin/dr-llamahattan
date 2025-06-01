import {defineStore} from "pinia";
import {ref, type Ref} from "vue";
import type {Person, PersonItem} from "../types/Person.ts";
import {usePersonService} from "../services/person.ts";

export const usePersonStore = defineStore("person", () => {
    const person: Ref<Person | undefined> = ref(undefined)
    const persons: Ref<PersonItem[]> = ref([])
    const loading: Ref<boolean> = ref(false)

    async function load() {
        loading.value = true
        persons.value = await usePersonService().getPersons()
        person.value = await usePersonService().getPerson()
        loading.value = false
    }

    return {
        persons,
        person,
        loading,
        load,
    }
})