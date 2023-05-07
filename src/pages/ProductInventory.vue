<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div ref="inventory">
      <div>
        <p class="text-h6">Inventory Management</p>
        <p class="text-weight-regular text-subtitle1">
          Manage your categories and products
        </p>
      </div>
      <q-input v-model="filter" label="Search Product" class="q-mb-md" />
      <q-scroll-area style="height: 50px; width: 100%">
        <div class="row no-wrap">
          <q-chip
            v-for="categ in reactiveCateg"
            :key="categ.id"
            v-model:selected="categ.isSelected"
            color="grey-5"
            text-color="white"
          >
            {{ categ.category }}
          </q-chip>
        </div>
      </q-scroll-area>

      <div class="q-my-sm row justify-end">
        <q-checkbox v-model="lowStocks" label="Low Stocks" color="red" />
      </div>
      <q-scroll-area
        :style="`height: ${containerHeight}px`"
        v-if="products.length > 0"
      >
        <div class="row">
          <div
            v-for="product in filteredData"
            :key="product.productName"
            class="col-6"
          >
            <router-link :to="`/update-product/${product.id}`">
              <product-grid
                :id="product.id"
                :product-name="product.name"
                :category="product.categories"
                :price="formatCurrency(product.price)"
                :image="product.file"
                :qty="product.stocks"
              />
            </router-link>
          </div>
        </div>
      </q-scroll-area>
      <p v-else class="q-mt-md text-subtitle1 text-grey-6">
        No products available. You may add your product by clicking the plus
        icon below.
      </p>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="green-10"
        :to="{ name: appRoute.ADD_PRODUCT }"
      />
    </q-page-sticky>
  </q-page>
</template>
<script setup>
import { appRoute } from "src/router/constants";
import { productCategories } from "src/helpers/categories";
import ProductGrid from "src/components/ProductGrid.vue";
import { useProduct } from "src/composable/products";
import { ref, onMounted, computed, reactive } from "vue";
import { formatCurrency } from "../helpers/utilities";

import { dom } from "quasar";
const { height } = dom;

const filter = ref("");
const lowStocks = ref(false);
const reactiveCateg = reactive([...productCategories]);

/* eslint-disable no-unused-vars */
const selectedCateg = computed(() => {
  return reactiveCateg
    .filter((categ) => categ.isSelected == true)
    .map((categ) => categ.id)
    .join(", ");
});

const products = useProduct();

/** Element Refs */
const containerHeight = ref(200);

const OFFSET_HEIGHT = 55;
const TOP_EL_HEIGHT = 32 + 28 + 56 + 20 + 36; //Heading and subheading
const BOTTOM_NAV = 72;

onMounted(() => {
  containerHeight.value =
    height(window) - (TOP_EL_HEIGHT + OFFSET_HEIGHT + BOTTOM_NAV);
});

const filteredData = computed(() => {
  return filter.value.trim() !== ""
    ? products.value
        .filter((data) => {
          return (
            data.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
          );
        })
        .filter((data) => {
          if (selectedCateg.value.length == 0) return data;

          let hasMatch = false;

          for (let i = 0; i < data.categories.length; i++) {
            for (let j = 0; j < selectedCateg.value.length; j++) {
              if (data.categories[i] == selectedCateg.value[j]) {
                hasMatch = true;
              }
            }
          }

          return hasMatch && data;
        })
        .filter((data) => {
          return lowStocks.value
            ? parseFloat(data.stocks) <= parseFloat(data.lowLevelStock)
            : true;
        })
    : products.value
        .filter((data) => {
          if (selectedCateg.value.length == 0) return data;

          let hasMatch = false;

          for (let i = 0; i < data.categories.length; i++) {
            for (let j = 0; j < selectedCateg.value.length; j++) {
              if (data.categories[i] == selectedCateg.value[j]) {
                hasMatch = true;
              }
            }
          }

          return hasMatch && data;
        })
        .filter((data) => {
          return lowStocks.value
            ? parseFloat(data.stocks) <= parseFloat(data.lowLevelStock)
            : true;
        });
});
</script>
