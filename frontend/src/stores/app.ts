import {defineStore} from "pinia";
import {ref, type Ref, watch} from "vue";

export const useAppStore = defineStore("app", () => {
    const activeUserId: Ref<string> = ref(localStorage.getItem("userId") || "")
    const showUserPicker: Ref<boolean> = ref(false)
    watch(activeUserId, () => {
        localStorage.setItem("userId", activeUserId.value)
        if (!activeUserId.value) showUserPicker.value = true
    }, {immediate: true})
    return {
        showUserPicker,
        activeUserId
    }
})