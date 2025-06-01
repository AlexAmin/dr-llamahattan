<template>
  <div class="space-y-4 max-w-xl mx-auto">
    <ul class="divide-y divide-gray-800 w-full">
      <li v-for="user in person.persons" :key="user.id"
          class="w-full py-4 px-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          @click="()=>selectUser(user)">
        <div class="flex items-center">
          <span class="text-sm font-medium text-gray-900">{{ user.name||user.id }}</span>
        </div>
        <button @click.stop="openDeleteDialog(user)"
                class="ml-4 text-red-600 hover:text-red-900">
          Delete
        </button>
      </li>
    </ul>
    <button @click="newUser">New User</button>
  </div>
</template>
<script lang="ts" setup>
import {usePersonStore} from "@/stores/person.ts";
import type {PersonItem} from "@/types/Person.ts";
import {useAppStore} from "@/stores/app.ts";
import {usePersonService} from "@/services/person.ts";

const person = usePersonStore()
const app = useAppStore()

const selectUser = (user: PersonItem) => {
  app.activeUserId = user.id
  app.showUserPicker = false
}

const openDeleteDialog = (user: PersonItem) => {
  const confirmed = confirm("Delete " + JSON.stringify(user))
  if (!confirmed) return
  usePersonService().deletePerson(user.id)
  person.load()
}

function newUser(){
  usePersonService().createPerson()
  person.load()
}
</script>