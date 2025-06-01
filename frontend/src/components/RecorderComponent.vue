<template>
  <div class="flex flex-col max-w-3xl mx-auto my-auto">
    <div class="flex flex-row items-center justify-center
                transition-all duration-300 ease-in-out
                rounded-full overflow-hidden w-full
                shadow-xl
              bg-app-100 dark:bg-app-dark"
         :class="[isRecording ? 'w-96':'w-12']">
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
             class="absolute w-3 h-3 rounded-full bg-red-500 animate-pulse text-2xl"/>
        <PhStop
            v-if="isRecording"
            class="text-white h-10 w-10"
            :class="{
            'animate-pulse': isRecording
          }"/>
        <PhMicrophone
            v-else
            class="text-white h-10 w-10"
            :class="{
            'animate-pulse': isRecording
          }"
            :size="24"
        />
      </div>
      <div v-if="question && question.length > 0" class="flex flex-row mr-auto p-4">
        <span class="text-2xl font-light pl-1 pr-3">{{ question }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {type Ref, ref} from 'vue'
import {PhMicrophone, PhStop} from '@phosphor-icons/vue'
import {type AxiosResponse} from 'axios'
import {encodeWAVChunk} from "@/util/wav.ts";
import {recordFromMic} from "@/util/mic.ts";
import apiClient from "@/apiClient.ts";

const isRecording = ref(false)
const topic: Ref<string> = ref("")
const previousScore: Ref<number> = ref(0)
const question: Ref<string> = ref("")
let lastQuestionChange: number = -1

apiClient.get("/prompt/question")
    .then((result: AxiosResponse) => {
      question.value = result.data.question
    })

let recorder: MediaRecorder | undefined = undefined
const toggleRecording = async () => {
  isRecording.value = !isRecording.value
  let data: Float32Array = new Float32Array()
  console.log("Recording from device mic...")
  if (recorder) recorder.stop()
  if (isRecording.value) recorder = await recordFromMic((chunk: Float32Array) => data = chunk)
  while (isRecording.value) {
    await sendStreamedData(data)
        .catch(() => console.log("transcript failed"))
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
  const result = await apiClient.post(
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
  const resultData = result.data as { question?: string, topic: string, score: number }
  if (resultData.question) {
    const timeSince = lastQuestionChange === -1 ? Number.MAX_SAFE_INTEGER : new Date().getTime() - lastQuestionChange
    if (timeSince <= 10 * 1000) return
    lastQuestionChange = new Date().getTime()
    question.value = resultData.question
  }
  topic.value = resultData.topic
  previousScore.value = resultData.score
}

async function promptPerson(data: Float32Array) {
  const formData = formDataFromFloat32(data)
  await apiClient.post(
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