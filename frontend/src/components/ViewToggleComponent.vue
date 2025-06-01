<template>
  <nav class="flex justify-center p-4">
    <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      <button
          v-for="view in AppView"
          @click="()=>$emit('update:modelValue', view)"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            modelValue === view
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          ]"
      >
        {{ view }}
      </button>
    </div>
  </nav>
</template>
<script lang="ts" setup>
import {AppView} from "../types/AppView.ts";

defineProps<{
  modelValue: AppView
}>()
defineEmits(["update:modelValue"])
</script>