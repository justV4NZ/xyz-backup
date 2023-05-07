<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div ref="inventory">
      <q-input v-model="filter" label="Search Product" class="q-mb-md" />
      <q-scroll-area style="height: 50px; width: 100%">
        <div class="row no-wrap">
          <q-chip
            v-for="categ in reactiveCateg"
            :key="categ.id"
            v-model:selected="categ.isSelected"
            color="grey-6"
            text-color="white"
          >
            {{ categ.category }}
          </q-chip>
        </div>
      </q-scroll-area>

      <div class="q-mt-sm"></div>
      <q-scroll-area
        v-if="products.length > 0"
        :style="`height: ${containerHeight}px`"
      >
        <div class="row">
          <div
            v-for="product in filteredData"
            :key="product.productName"
            class="col-6"
          >
            <product-grid
              :id="product.id"
              :product-variants="product.variants.length"
              :product-name="product.name"
              :category="product.categories"
              :price="formatCurrency(product.price)"
              :qty="product.stocks"
              :image="product.file"
              @click.prevent="showAddtoCartModal(product)"
            />
          </div>
        </div>
      </q-scroll-area>
      <p v-else class="q-mt-md text-subtitle1 text-grey-6">
        No products available. You may add your product by clicking the plus
        icon
      </p>
    </div>

    <q-dialog v-model="summary" seamless position="bottom" class="">
      <q-card class="full-width fragment-radius">
        <q-linear-progress :value="0.5" color="green" />
        <q-card-section class="row items-center no-wrap q-pt-sm q-pb-md">
          <div class="text-caption">
            <div class="text-weight-bold text-h6">Order Summary</div>
            <div class="">SubTotal: {{ subTotal }}</div>
          </div>
          <q-space />
          <q-btn flat round icon="arrow_forward" to="/cart/summary" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addToCartModal">
      <q-card class="full-width">
        <q-card-section class="q-py-sm q-mt-sm">
          <div class="q-mb-md">
            <p class="text-h6 text-weight-bold">Add To Cart</p>
            <p>How many would you like to add</p>
          </div>
          <q-form ref="cartModalForm">
            <q-input
              v-model="selectedProduct.name"
              label="Product"
              aria-disabled="true"
              readonly
            />
            <q-input
              v-model="cartItem.qty"
              label="Quantity"
              :rules="[maxQuantity]"
            />
          </q-form>
          <p>Max Quantity: {{ selectedProduct.stocks }}</p>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-sm q-mt-md">
          <q-btn
            v-close-popup
            flat
            label="Cancel"
            color="primary"
            :disable="isBtnLoading"
          />
          <q-btn
            flat
            label="Add to Cart"
            color="green"
            :loading="isBtnLoading"
            @click.prevent="addToCart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { productCategories } from "src/helpers/categories";
import ProductGrid from "src/components/ProductGrid.vue";
import { useProduct } from "src/composable/products";
import { ref, onMounted, computed, reactive } from "vue";
import { formatCurrency } from "../helpers/utilities";
import { useCart } from "src/composable/cart";
import { useQuasar } from "quasar";

import { dom } from "quasar";
const { height } = dom;

const filter = ref("");
const summary = ref(true);
const addToCartModal = ref(false);
const isBtnLoading = ref(false);

const cart = useCart();
const products = useProduct();
const $q = useQuasar();

const cartItem = reactive({ qty: 0, total: 0, price: 0, name: "", id: null });

const cartModalForm = ref("");
const selectedProduct = ref({});
const reactiveCateg = reactive([...productCategories]);

/* eslint-disable no-unused-vars */
const selectedCateg = computed(() => {
  return reactiveCateg
    .filter((categ) => categ.isSelected == true)
    .map((categ) => categ.id)
    .join(", ");
});
/** Element Refs */
const containerHeight = ref(200);

const OFFSET_HEIGHT = 55;
const TOP_EL_HEIGHT = 32 + 28 + 56 + 20 + 36; //Heading and subheading
const BOTTOM_NAV = 88;

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
    : products.value.filter((data) => {
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
      });
});
const showAddtoCartModal = (product) => {
  cartItem.qty = 0;
  cartItem.name = product.name;
  cartItem.id = product.id;
  cartItem.price = product.price;
  selectedProduct.value = product;
  addToCartModal.value = true;
};

const addToCart = () => {
  cartModalForm.value.validate();

  if (cartItem.qty == 0) {
    addToCartModal.value = false;
    return;
  }

  let shouldUpdate = false;
  let cartIndex = 0;

  cart.value.map((item, index) => {
    if (item.id == cartItem.id) {
      cartIndex = index;
      shouldUpdate = true;
    }
  });

  if (shouldUpdate) {
    if (
      parseInt(cart.value[cartIndex].qty) + parseInt(cartItem.qty) >
      selectedProduct.value.stocks
    ) {
      $q.notify({
        position: "top",
        color: "red",
        icon: "close",
        message: "Insufficient stocks",
      });

      return;
    }

    cart.value[cartIndex] = {
      id: cart.value[cartIndex].id,
      name: cart.value[cartIndex].name,
      qty: parseInt(cart.value[cartIndex].qty) + parseInt(cartItem.qty),
      price: cartItem.price,
      maxQty: parseInt(selectedProduct.value.stocks),
      total:
        (parseInt(cart.value[cartIndex].qty) + parseInt(cartItem.qty)) *
        parseInt(cartItem.price),
      updatedAt: Date.now(),
    };
  } else {
    cart.value.unshift({
      ...cartItem,
      maxQty: parseInt(selectedProduct.value.stocks),
      total: cartItem.qty * cartItem.price,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  $q.notify({
    position: "top",
    color: "green",
    icon: "done_all",
    message: "Product added to cart successfully!",
  });

  addToCartModal.value = false;
};

const maxQuantity = (v) => {
  const maxQty = parseInt(selectedProduct.value.stocks);
  if (parseInt(v) > maxQty) {
    return "Insufficient stocks. Please lower your quantity";
  }
};

let subTotal = computed(() => {
  let total = 0;
  cart.value.map((item) => {
    if (item.total) {
      total += item.total;
    }
  });
  return formatCurrency(total);
});
</script>
