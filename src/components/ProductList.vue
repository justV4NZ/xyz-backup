<template>
  <q-list>
    <q-item class="q-px-none q-gutter-sm">
      <img
        v-if="filePath"
        :src="filePath"
        alt=""
        class="img-list rounded-borders"
      />
      <img
        v-else
        src="../assets/images/img-placeholder.png"
        alt=""
        height="50"
        width="50"
      />
      <q-item-section>
        <div class="row">
          <div>
            <q-item-label class="text-capitalize">
              {{ productName }}
            </q-item-label>
            <q-item-label caption lines="2">
              <q-chip
                v-for="categ in mappedCategory.slice(0, 1)"
                :key="categ.id"
                color="grey-7"
                text-color="white"
                size="sm"
              >
                {{ categ.category }}
              </q-chip>
              <q-chip v-if="mappedCategory.length > 0" size="sm">
                +{{ mappedCategory.length - 1 }} Categories
              </q-chip>
              <q-chip v-else size="sm">Uncategorized</q-chip>
            </q-item-label>
          </div>
        </div>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>PHP {{ price }}</q-item-label>
        <q-item-label caption>QTY: {{ qty }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { productCategories } from "src/helpers/categories";
import {
  Filesystem,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";

const mappedCategory = ref([]);
const filePath = ref("");

const props = defineProps({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: [String, Array],
    default: null,
    required: false,
  },
  price: {
    type: [Number, String],
    required: true,
  },
  qty: {
    type: [Number, String],
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
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
  mappedCategory.value = productCategories.filter((categ) =>
    props.category?.includes(categ.id)
  );

  if (!props.image) return;
  const res = await fileRead(props.image);
  filePath.value = `data:image/jpeg;base64,${res.data}`;
});
</script>
