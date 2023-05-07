<template>
  <div class="relative-position rounded-borders q-mr-sm">
    <img
      v-if="filePath"
      :src="filePath"
      alt=""
      class="img-fluid rounded-borders"
    />
    <img
      v-else
      src="../assets/images/img-placeholder.png"
      alt=""
      class="img-fluid rounded-borders"
    />
    <div class="img-description">
      <p class="ellipsis q-mb-sm">{{ productName }}</p>
      <div class="row justify-between">
        <span>{{ price }}</span>
        <span>QTY: {{ qty }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import {
  Filesystem,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";

const filePath = ref("");

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: [String, Array],
    required: true,
  },
  price: {
    type: [Number, String],
    required: true,
  },
  qty: {
    type: [Number, String],
    required: true,
  },
  // productVariants: {
  //   type: [String, Number],
  // },
});

const fileRead = async (file) => {
  let content = await Filesystem.readFile({
    path: `products/${file}`,
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8,
  });

  return content;
};

onMounted(async () => {
  if (!props.image) return;
  const res = await fileRead(props.image);
  filePath.value = `data:image/jpeg;base64,${res.data}`;
});
</script>
