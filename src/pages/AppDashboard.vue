<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div ref="summary">
      <div>
        <p class="text-h6">Hello, {{ settings?.storeName ?? "User!" }}!</p>
        <p class="text-weight-regular text-subtitle1">
          Welcome, Here is your store summary.
        </p>
      </div>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card flat class="shadow-2 bg-primary text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Today's Sales</p>
                <p class="text-h5 q-pt-sm">{{ formatCurrency(totalSales) }}</p>
              </q-card-section>
              <q-card-section>
                <q-icon name="payments" size="72px" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-gutter-sm items-stretch" style="margin-top: 0px">
        <div class="col">
          <q-card
            flat
            class="shadow-2 bg-yellow-9 text-white q-px-sm full-height"
          >
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-h4">{{ products.length }}</p>
                <p class="text-caption">Total Products</p>
              </q-card-section>
              <q-card-section>
                <q-icon name="inventory_2" size="48px" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card
            flat
            class="shadow-2 bg-yellow-9 text-white q-px-sm full-height"
          >
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-h4">{{ lowStocks }}</p>
                <p class="text-caption">Low Stocks</p>
              </q-card-section>
              <q-card-section>
                <q-icon name="error" size="48px" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-mt-sm">
        <div class="col-12">
          <router-link
            :to="{ name: 'Point of Sales' }"
            class="text-decoration-none"
          >
            <q-card
              flat
              v-ripple
              class="shadow-2 bg-green-10 text-white q-px-sm relative-position"
            >
              <q-card-section
                horizontal
                class="items-center row justify-between"
              >
                <q-card-section class="q-pa-md row">
                  <div class="q-ml-lg">
                    <q-icon name="point_of_sales" size="48px" />
                  </div>
                  <div class="col">
                    <p class="text-h6">Point of Sales</p>
                    <p class="text-caption">Sales and payments</p>
                  </div>
                </q-card-section>
                <q-btn
                  icon="arrow_forward"
                  unelevated
                  :to="{ name: 'Point of Sales' }"
                  rounded
                ></q-btn>
              </q-card-section>
            </q-card>
          </router-link>
        </div>
      </div>
    </div>

    <div class="q-mt-md">
      <div>
        <p class="text-h6">Recent Products</p>
        <p class="text-weight-regular text-subtitle1">
          Here are your recently added products
        </p>
      </div>
      <div
        v-if="products.length > 0"
        ref="scrollableTransaction"
        class="q-mt-sm"
      >
        <q-scroll-area :style="`height: ${containerHeight}px`">
          <product-list
            v-for="product in products"
            :key="product.productName"
            :product-name="product.name"
            :category="product.categories"
            :image="product.file"
            :price="formatCurrency(product.price)"
            :qty="product.stocks"
          />
        </q-scroll-area>
      </div>
      <p v-else class="q-mt-md text-subtitle1 text-grey-6">
        No products available. You may add your product by clicking the plus
        icon
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
import ProductList from "src/components/ProductList.vue";
import { appRoute } from "src/router/constants";
import { ref, onMounted, computed } from "vue";
import { useProduct } from "src/composable/products";
import { useTransactions } from "src/composable/transactions";
import { formatCurrency } from "../helpers/utilities";
import { useAppSettings } from "src/composable/app-settings";
import moment from "moment";

import { dom } from "quasar";
const { height } = dom;

const settings = useAppSettings();
const products = useProduct();
const transactions = useTransactions();
const scrollableTransaction = ref("");

/** Element Refs */
const containerHeight = ref(200);
const summary = ref(200);

const NAV_HEIGHT = 72;
const OFFSET_HEIGHT = 70;
const RECENT_HEADING_HEIGHT = 32 + 16; //Heading and subheading

onMounted(() => {
  containerHeight.value =
    height(window) -
    (height(summary.value) +
      NAV_HEIGHT +
      RECENT_HEADING_HEIGHT +
      OFFSET_HEIGHT);
});

let lowStocks = computed(() => {
  let lowStocks = 0;
  products.value.map((prod) => {
    if (parseInt(prod.stocks) <= parseInt(prod.lowLevelStock)) {
      lowStocks += 1;
    }
  });

  return lowStocks;
});

let totalSales = computed(() => {
  let total = 0;

  transactions.value.map((trans) => {
    if (trans.totalAmount) {
      if (moment(trans.createdAt).isSame(moment(), "day")) {
        total += parseFloat(trans.totalAmount);
      }
    }
  });
  return total;
});
</script>
