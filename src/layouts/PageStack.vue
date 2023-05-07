<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white shadow-2">
      <q-toolbar class="text-black q-py-md">
        <q-btn
          padding="none"
          unelevated
          icon="arrow_back"
          @click.prevent="router.back()"
        ></q-btn>
        <q-toolbar-title class="px-none text-h6">
          {{ route.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
</script>
