<template>
  <div class="flex flex-col h-dvh w-dvw overflow-hidden py-5 pt-12 bg-app-dark-50">
    <div class="flex flex-row h-full w-fit mx-auto">

      <!-- left panel -->
      <div :class="'panel h-full rounded-lg bg-amber-50 ' + (activePanel == 'left' ? 'w-150' : 'w-16')"
        @click="() => activePanel = 'left'">
        <!-- recording interface -->
        <div v-show="activePanel == 'left'" class="mx-auto px-5 pt-3">
          <div class="text-md mx-auto text-center">
            Tap the record button to preserve anything through audio recording.
          </div>
          <div class="mt-4 bg-app-dark-200 p-4 rounded-lg">
            <!-- Recorder component -->
            <div class="flex flex-col w-full h-full gap-x-2 gap-y-4">
              <div class="flex flex-col w-full pt-2 rounded-md bg-app-color-offset">
                <span class="text-xs text-app-text-secondary mx-auto">
                  Audio Source
                </span>
                <!-- Device List -->
                <Menu as="div" class="relative mx-auto inline-block text-left text-xs text-gray-400">
                  <MenuButton class="inline-flex mx-auto gap-x-1.5 px-2 py-1 cursor-pointer">
                    {{ recordingSourceName }}
                    <PhMicrophone class="h-4 w-4" />
                    <PhCaretDown class="h-4 w-4" />
                  </MenuButton>
                  <MenuItems class="absolute right-0 z-10 mt-1 w-60 origin-top-right rounded-md focus:outline-none shadow-lg ring-1 text-right
                    bg-app-dark-50 ring-black/5 text-app-color-dark">
                    <div class="py-1">
                      <MenuItem as="div" v-for="device in deviceList" :key="device.id"
                        @click="() => selectDevice(device)"
                        class="px-3 py-1.5 text-xs text-white cursor-pointer hover:bg-app-bar-hover">
                      {{ device.name }}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
              <div class="flex flex-col mx-auto items-center gap-y-4 pb-4">
                <div class="text-6xl font-light text-white">
                  {{ recordingDurationFormat }}
                </div>
                <div class="flex flex-row items-center justify-center gap-x-1">
                  <button
                    :class="['bg-red-400 dark:bg-red-700 cursor-pointer dark:text-white rounded-full w-18 h-18 flex items-center justify-center', (isRecording ? 'pulse-bg' : '')]"
                    @click="startRecording">
                    <PhMicrophone class="h-8 w-8 text-white" />
                  </button>
                  <button
                    class="bg-gray-400 dark:bg-gray-700 cursor-pointer dark:text-white rounded-full w-12 h-12 flex items-center justify-center"
                    @click="stopRecording">
                    <PhStop class="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- recommended topics -->
        <div v-show="activePanel == 'left'"
          class="mx-auto flex flex-wrap gap-y-1.5 gap-x-1 px-5 pt-2 pb-5">
          <div class="text-lg mx-auto text-center text-app-text-secondary">
            Here are some topics you might want to tell me about
          </div>
          <div v-for="topic in recommendedTopics" :key="topic.path"
            class="rounded-sm text-xs p-1 px-2 bg-app-300 mx-auto">
            {{ topic.question }}
          </div>
        </div>
      </div>

      <!-- right panel -->
      <div :class="'panel h-full rounded-lg bg-gray-400 px-7 py-5 gap-2 flex flex-wrap flex-row max-h-32' + (activePanel == 'right' ? 'w-150' : 'w-16')"
        @click="() => activePanel = 'right'">
        <div v-show="activePanel == 'right'" v-for="chapter in chapters" :key="chapter.id" 
          class="flex flex-col w-36 h-20 px-4 py-2 gap-y-2 border-2 bg-red-600"
          :style="'background-image: url(\'' + chapter.image + '\'); background-size: cover; background-position: center;'">
          <div class="text-sm font-semibold">
            {{ chapter.name }}
          </div>
          <div class="text-xs text-app-text-secondary">
            {{ chapter.title }}
          </div>
          <div class="text-xs text-app-text-secondary mt-1">
            {{ chapter.description }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { computed, ref, onMounted } from "vue";
import type { AudioSource } from "./types/AudioSource";
import type { AudioSegment } from "./types/AudioSegment";
import { PhStop, PhMicrophone, PhCaretDown } from "@phosphor-icons/vue";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

const recommendedTopics = ref([
  {
    path: 'personalInformation.currentName',
    missing: false,
    question: 'What is your current name?'
  },
  {
    path: 'personalInformation.birthName',
    missing: true,
    question: 'What was your birth name?'
  },
  {
    path: 'personalInformation.birthDate',
    missing: true,
    question: 'What is your birth date?'
  },
  {
    path: 'personalInformation.birthPlace',
    missing: true,
    question: 'What is your birth place?'
  },
  {
    path: 'personalInformation.gender',
    missing: true,
    question: 'What is your gender?'
  },
  {
    path: 'attributes.skills',
    missing: true,
    question: 'What are your skills?'
  },
  {
    path: 'attributes.hobbies',
    missing: true,
    question: 'What are your hobbies?'
  },
  {
    path: 'attributes.beliefs',
    missing: true,
    question: 'What are your beliefs?'
  },
  {
    path: 'attributes.values',
    missing: true,
    question: 'What are your values?'
  },
  {
    path: 'attributes.personalityTraits',
    missing: true,
    question: 'What are your personality traits?'
  },
  {
    path: 'physicalCharacteristics.heightCm',
    missing: true,
    question: 'What is your height in centimeters?'
  },
  {
    path: 'physicalCharacteristics.weightKg',
    missing: true,
    question: 'What is your weight in kilograms?'
  },
  {
    path: 'physicalCharacteristics.eyeColor',
    missing: true,
    question: 'What is your eye color?'
  },
  {
    path: 'physicalCharacteristics.hairColor',
    missing: true,
    question: 'What is your hair color?'
  },
  {
    path: 'digitalFootprint.socialMedia',
    missing: true,
    question: 'What are your social media profiles?'
  },
  {
    path: 'digitalFootprint.emails',
    missing: true,
    question: 'What are your email addresses?'
  },
  {
    path: 'digitalFootprint.phoneNumbers',
    missing: true,
    question: 'What are your phone numbers?'
  },
  {
    path: 'digitalFootprint.websites',
    missing: true,
    question: 'What are your websites?'
  },
  {
    path: 'relationships',
    missing: false,
    question: 'Who are your relationships?'
  },
  {
    path: 'education',
    missing: true,
    question: 'What is your education history?'
  },
  {
    path: 'employment',
    missing: true,
    question: 'What is your employment history?'
  },
  {
    path: 'residences',
    missing: false,
    question: 'What are your residences?'
  },
  { path: 'assets', missing: true, question: 'What are your assets?' }
]);
const chapters = ref([
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'personalInformation', 'name': 'Personal Information', 'title': 'Please introduce yourself', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'earlyLife', 'name': 'Early Life', 'title': 'My early life in XYZ', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'school', 'name': 'School', 'title': 'School was tough', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'meetingMyPartner', 'name': 'Meeting my partner', 'title': 'Meeting my partner', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'movingToGermany', 'name': 'Moving to Germany', 'title': 'Moving to Germany', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'family', 'name': 'family', 'title': 'My large family', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'earlyLife', 'name': 'Early Life', 'title': 'My early life in XYZ', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'school', 'name': 'School', 'title': 'School was tough', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'meetingMyPartner', 'name': 'Meeting my partner', 'title': 'Meeting my partner', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'movingToGermany', 'name': 'Moving to Germany', 'title': 'Moving to Germany', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  { 'image': 'https://firebasestorage.googleapis.com/v0/b/dr-lamahattan.firebasestorage.app/o/podcast-cover-images%2FpMHR17AV4vxmsfuDwAz2.png?alt=media', 'id': 'family', 'name': 'family', 'title': 'My large family', 'description': 'eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw eeerewr wer rwe ewr eew eewrwerw' },
  
]);
const activePanel = ref("left"); // "left" or "right"
const isRecording = ref(false);
const recordingSourceName = ref("");
let durationInterval: number | undefined = undefined;
const recordingDuration = ref<number>(0);
const recordingDurationFormat = computed(() => {
  return moment()
    .startOf("day")
    .add(recordingDuration.value, "seconds")
    .format("HH:mm:ss");
});
let chunks = [] as Blob[];
let mediaRecorder: MediaRecorder | undefined = undefined;
const options = { audioBitsPerSecond: 192000, mimeType: 'audio/webm;codecs=opus' };
const deviceList = ref([] as AudioSource[]);
const segmentCounter = ref(0);
const recordings = ref([] as AudioSegment[]);
let getUserMediaPromise: Promise<MediaStream>;

async function loadDevices(): Promise<void> {
  deviceList.value = [];
  const devices = await navigator.mediaDevices.enumerateDevices()
  devices.forEach(device => {
    if (device.kind !== "audioinput") return;
    deviceList.value.push({
      id: device.deviceId,
      name: device.label
    } as AudioSource);
  });
}

async function selectDevice(device: AudioSource) {
  recordingSourceName.value = device.name;
  stopRecording();
  // dispose();
  await initialize(device);
}

function startRecording() {
  if (isRecording.value) return;
  if (mediaRecorder && mediaRecorder.state === "inactive") {
    recordingDuration.value = 0;
    mediaRecorder.start();
    console.log("MediaRecorder started.");
    isRecording.value = true;
    durationInterval = window.setInterval(() => {
      recordingDuration.value += 0.05;
    }, 50) as number;
  }
}

function stopRecording() {
  if (!isRecording.value) return;
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("MediaRecorder stopped.");
    isRecording.value = false;
    if (durationInterval) {
      clearInterval(durationInterval);
      durationInterval = undefined;
    }
  }
}

async function getUserMedia(source: AudioSource | null = null) {
  if (navigator.mediaDevices.getUserMedia) {
    let onSuccess = function (stream: MediaStream) {
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.onstop = function (e: Event) {
        segmentCounter.value += 1;
        const name = "Segment #" + segmentCounter.value;
        const blob = new Blob(chunks, { type: mediaRecorder?.mimeType });
        chunks = [];
        const url = window.URL.createObjectURL(blob);
        recordings.value.push({
          name: name,
          url: url,
          blob: blob,
          type: mediaRecorder?.mimeType,
          duration: recordingDuration.value
        } as AudioSegment);
      };
      mediaRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
    };
    let onError = (err: any) => console.error("The following error occured: " + err);
    let constraints: MediaStreamConstraints = { audio: { deviceId: { exact: source?.id } } };
    getUserMediaPromise = navigator.mediaDevices.getUserMedia(constraints);
    getUserMediaPromise.then(onSuccess, onError);
  }
  else {
    console.error("MediaDevices.getUserMedia() not supported on your browser!");
  }
}

async function initialize(device: AudioSource | null = null) {
  await loadDevices();
  await getUserMedia(device);
  const stream = await getUserMediaPromise;
  recordingSourceName.value = stream.getTracks().map(track => track.label).join(", ");
}

onMounted(async () => await initialize());

</script>

<style scoped>
/* Pulsating animation for recording button */
@keyframes pulse {
  0% {
    background-color: red;
  }

  50% {
    background-color: rgb(128, 0, 0);
  }

  100% {
    background-color: red;
  }
}

.pulse-bg {
  animation: pulse 1.75s infinite;
}

.panel {
  cursor: pointer;
  transition: width 300ms ease;
}

/* Move animation for recordings */
.recording-move {
  transition: transform 300ms cubic-bezier(0.25, 1, 0.5, 1);
}

.recording-enter-active,
.recording-leave-active {
  transition: opacity 300ms ease;
}

.recording-enter-from,
.recording-leave-to {
  opacity: 0;
}
</style>