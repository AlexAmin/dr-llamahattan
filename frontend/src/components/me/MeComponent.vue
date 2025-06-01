<template>
  <LoadingSpinnerComponent v-if="person.loading"/>
  <div v-else class="flex flex-col space-y-8 p-6">
    <!-- Personal Information Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Personal Information</h2>
      <div class="grid grid-cols-2 gap-4">
        <div><span class="font-semibold">Current Name:</span> {{ person.person?.personalInformation.currentName }}</div>
        <div><span class="font-semibold">Birth Name:</span> {{ person.person?.personalInformation.birthName }}</div>
        <div><span class="font-semibold">Birth Date:</span> {{ person.person?.personalInformation.birthDate }}</div>
        <div><span class="font-semibold">Birth Place:</span> {{ person.person?.personalInformation.birthPlace }}</div>
        <div><span class="font-semibold">Gender:</span> {{ person.person?.personalInformation.gender }}</div>
      </div>
    </section>

    <!-- Physical Characteristics Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Physical Characteristics</h2>
      <div class="grid grid-cols-2 gap-4">
        <div><span class="font-semibold">Height:</span> {{ person.person?.physicalCharacteristics.heightCm }} cm</div>
        <div><span class="font-semibold">Weight:</span> {{ person.person?.physicalCharacteristics.weightKg }} kg</div>
        <div><span class="font-semibold">Eye Color:</span> {{ person.person?.physicalCharacteristics.eyeColor }}</div>
        <div><span class="font-semibold">Hair Color:</span> {{ person.person?.physicalCharacteristics.hairColor }}</div>
      </div>
    </section>

    <!-- Attributes Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Attributes</h2>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-2">Skills</h3>
          <ul class="list-disc list-inside">
            <li v-for="skill in person.person?.attributes.skills" :key="skill">{{ skill }}</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Hobbies</h3>
          <ul class="list-disc list-inside">
            <li v-for="hobby in person.person?.attributes.hobbies" :key="hobby">{{ hobby }}</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Beliefs</h3>
          <ul class="list-disc list-inside">
            <li v-for="belief in person.person?.attributes.beliefs" :key="belief">{{ belief }}</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Values</h3>
          <ul class="list-disc list-inside">
            <li v-for="value in person.person?.attributes.values" :key="value">{{ value }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Relationships Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Relationships</h2>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="relationship in person.person?.relationships" :key="relationship.name"
             class="p-4 border rounded-lg">
          <div class="font-semibold">{{ relationship.name }}</div>
          <div class="text-gray-600">{{ relationship.type }}</div>
          <div class="text-sm">{{ relationship.details }}</div>
        </div>
      </div>
    </section>

    <!-- Education Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Education</h2>
      <div class="space-y-4">
        <div v-for="edu in person.person?.education" :key="edu.institution"
             class="p-4 border rounded-lg">
          <div class="font-semibold">{{ edu.institution }}</div>
          <div>{{ edu.degree }} in {{ edu.fieldOfStudy }}</div>
          <div class="text-sm text-gray-600">{{ edu.period.startDate }} - {{ edu.period.endDate }}</div>
          <div class="text-sm">{{ edu.details }}</div>
        </div>
      </div>
    </section>

    <!-- Employment Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Employment History</h2>
      <div class="space-y-4">
        <div v-for="job in person.person?.employment" :key="job.company"
             class="p-4 border rounded-lg">
          <div class="font-semibold">{{ job.company }}</div>
          <div>{{ job.role }}</div>
          <div class="text-sm text-gray-600">{{ job.period.startDate }} - {{ job.period.endDate }}</div>
          <div class="text-sm">{{ job.description }}</div>
        </div>
      </div>
    </section>

    <!-- Residences Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Residences</h2>
      <div class="space-y-4">
        <div v-for="residence in person.person?.residences" :key="residence.address"
             class="p-4 border rounded-lg">
          <div class="font-semibold">{{ residence.address }}</div>
          <div class="text-sm text-gray-600">{{ residence.period.startDate }} - {{ residence.period.endDate }}</div>
        </div>
      </div>
    </section>

    <!-- Assets Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Assets</h2>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="asset in person.person?.assets" :key="asset.name"
             class="p-4 border rounded-lg">
          <div class="font-semibold">{{ asset.name }}</div>
          <div class="text-gray-600">Type: {{ asset.type }}</div>
          <div>Value: ${{ asset.value.toLocaleString() }}</div>
          <div class="text-sm">{{ asset.details }}</div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Life Events</h2>
      <div class="space-y-4">
        <div v-for="event in person.person?.events" :key="event.date"
             class="p-4 border rounded-lg">
          <div class="font-semibold">{{ event.type }}</div>
          <div class="text-sm text-gray-600">{{ event.date }}</div>
          <div class="text-sm">{{ event.details }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import {usePersonStore} from "@/stores/person.ts";
import LoadingSpinnerComponent from "@/components/LoadingSpinnerComponent.vue";
import {onMounted} from "vue";

const person = usePersonStore()

onMounted(()=>{
  if(!person.person) person.load()
})
</script>