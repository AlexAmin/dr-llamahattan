<template>
  <div class="flex flex-row items-center justify-center
  transition-all duration-300 ease-in-out
  rounded-full overflow-hidden
  shadow-xl
  bg-app-100 dark:bg-app-dark"
       :class="[isRecording ? 'w-96':'w-12']"
  >
    <div
        @click="()=>toggleRecording()"
        class="relative flex flex-col justify-center items-center
         mr-auto cursor-pointer
         p-4 rounded-r-lg transition-all duration-300 h-full"
        :class="{
        'bg-blue-500 hover:bg-blue-600': !isRecording,
        'bg-red-500 hover:bg-red-600': isRecording,
      }"
    >
      <div v-if="isRecording"
           class="absolute w-3 h-3 rounded-full bg-red-500 animate-pulse"/>
      <PhMicrophone
          class="text-white"
          :class="{
            'animate-pulse': isRecording
          }"
          :size="24"
      />
    </div>
  </div>
  <div class="flex flex-col">
    <LoadingSpinnerComponent v-if="isRecording && !checklist" class="mx-auto"/>
    <div v-else-if="isRecording" class="flex items-center gap-2">
      <div class="flex flex-col gap-1">
        <div v-for="(quality, key) in checklist" :key="key" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full"
               :class="{
                 'bg-red-500': quality === 'missing',
                 'bg-yellow-500': quality === 'bad',
                 'bg-green-500': quality === 'good'
               }"/>
          <span class="text-sm">{{ key }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {type Ref, ref} from 'vue'
import {PhMicrophone} from '@phosphor-icons/vue'
import axios from 'axios'
import {encodeWAVChunk} from "@/util/wav.ts";
import {recordFromMic} from "@/util/mic.ts";
import LoadingSpinnerComponent from "@/components/LoadingSpinnerComponent.vue";
import {Checklist} from "@/types/Checklist.ts";

const props = defineProps<{
  modelValue: any,
  schema: string
}>()
const emit = defineEmits<{
  "update:modelValue": [value: any],
  "feedback": [value: any]
}>()
const isRecording = ref(false)
const checklist: Ref<Checklist | undefined> = ref(undefined)

let recorder: MediaRecorder | undefined = undefined
const toggleRecording = async () => {
  isRecording.value = !isRecording.value
  checklist.value = []
  let data: Float32Array = new Float32Array()
  console.log("Recording from device mic...")
  if (recorder) recorder.stop()
  if (isRecording.value) recorder = await recordFromMic((chunk: Float32Array) => data = chunk)
  while (isRecording.value) {
    await sendStreamedData(data)
        .catch((e) => console.log("transcript failed"))
  }
  await promptPerson(data)
}

function formDataFromFloat32(data: Float32Array): FormData {
  const wavBuffer: ArrayBuffer = encodeWAVChunk(data, 48000)
  const blob = new Blob([wavBuffer], {type: "audio/wav"})
  const formData = new FormData()
  formData.append("file", blob, "chunk.wav")
  return formData
}

async function sendStreamedData(data: Float32Array) {
  const formData = formDataFromFloat32(data)
  const result = await axios.post(
      "http://localhost:3000/prompt/live",
      formData,
      {
        params: {},
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60 * 1000,
      }
  )
  checklist.value = result.data
  return null
}

async function promptPerson(data: Float32Array) {
  const formData = formDataFromFloat32(data)
  const result = await axios.post(
      "http://localhost:3000/prompt",
      formData,
      {
        params: {},
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60 * 1000,
      }
  )
  return null
}
</script>