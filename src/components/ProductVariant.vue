<template>
  <q-slide-item
    style=""
    right-color="red"
    @left="(opt) => swipedLeft(opt, id)"
    @right="swipedRight(id)"
  >
    <template #left>
      <q-icon name="edit" />
    </template>
    <template #right>
      <q-icon name="delete" />
    </template>

    <q-item class="q-mx-none q-px-none row">
      <q-item-section class="row">
        <p class="text-subtitle1">{{ name }}</p>
      </q-item-section>
      <q-item-section side top>
        <p class="text-subtitle1">PHP {{ price }}</p>
        <p class="text-grey-7">QTY: {{ qty }}</p>
      </q-item-section>
    </q-item>
  </q-slide-item>
</template>
<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: [Number, String],
    required: true,
  },
  price: {
    type: [Number, String],
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["swipedRight", "swipedLeft"]);

const swipedRight = (id) => {
  emit("swipedRight", id);
};

function swipedLeft({ reset }, id) {
  reset();
  emit("swipedLeft", id);
}
</script>
