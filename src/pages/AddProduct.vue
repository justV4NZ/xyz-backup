<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div>
      <div class="text-weight-bold text-h6">Product Info</div>
      <div class="text-grey">Enter your product information</div>
    </div>
    <q-form ref="form" @submit="saveProduct">
      <div class="q-gutter-sm">
        <input
          type="file"
          class="q-mt-lg"
          accept="image/*"
          @change="onImageSelect"
        />
        <q-input
          v-model="productData.name"
          label="Product Label"
          :rules="fieldRequired"
        />
        <q-select
          v-model="productData.categories"
          :options="productCategories"
          label="Category"
          option-value="id"
          option-label="category"
          :rule="fieldRequired"
          emit-value
          map-options
          multiple
          use-chips
          clearable
          virtual-scroll-slice-size="5"
        />
        <q-input
          v-model="productData.description"
          label="Description"
          :rules="fieldRequired"
        />
        <q-input
          v-model="productData.unit"
          label="Unit of Measurement"
          :rules="fieldRequired"
        />
        <div class="row q-gutter-sm q-mx-none">
          <div class="col">
            <q-input
              v-model="productData.price"
              type="number"
              label="Price"
              step="any"
              :rules="fieldRequired"
            />
          </div>
          <div class="col">
            <q-input
              v-model="productData.stocks"
              type="number"
              label="Stocks"
              step="any"
              :rules="fieldRequired"
            />
          </div>
        </div>
        <div class="row q-gutter-sm q-mx-none">
          <div class="col">
            <q-input
              v-model="productData.cost"
              type="number"
              label="Product Cost"
              step="any"
              :rules="fieldRequired"
            />
          </div>
          <div class="col">
            <q-input
              v-model="productData.lowLevelStock"
              type="number"
              label="Low Level"
              step="any"
              :rules="fieldRequired"
            />
          </div>
        </div>
      </div>
      <!-- <div class="q-mt-md">
        <div>
          <p class="text-h6">Product Variants</p>
          <p class="text-weight-regular text-caption">
            Manage the product variant
          </p>
        </div>
        <div class="row justify-end q-mt-sm">
          <q-btn
            unelevated
            color="primary"
            @click.prevent="
              variantModal.shown = true;
              variantModal.type = 'add';
            "
            >Add Variant</q-btn
          >
        </div>
        <div class="q-mt-md">
          <product-variant
            v-for="(product, i) in productData.variants"
            :id="i"
            :key="product.type"
            :name="product.type"
            :category="product.category"
            :price="product.price"
            :qty="product.qty"
            @swiped-right="removeVariant"
            @swiped-left="editVariant"
          />
          <p v-if="productData.variants.length == 0">
            No product variant added
          </p>
        </div>
      </div> -->
      <div class="row justify-end">
        <q-btn
          type="submit"
          unelevated
          color="primary"
          class="q-mt-lg"
          style="width: 100%; display: block"
          >Save Product</q-btn
        >
      </div>
    </q-form>
    <!--
    <q-dialog v-model="variantModal.shown" position="bottom">
      <q-card style="width: 100%">
        <q-card-section class="column no-wrap">
          <div>
            <div class="text-weight-bold text-h6">Product Variant</div>
            <div class="text-grey">Please fill-in all the fields</div>
          </div>
          <div>
            <q-input
              v-model="variant.type"
              label="Variant Type"
              :rules="fieldRequired"
            />
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <q-input
                v-model="variant.price"
                type="number"
                label="Price"
                :rules="fieldRequired"
              />
            </div>
            <div class="col">
              <q-input
                v-model="variant.cost"
                type="number"
                label="Cost"
                :rules="fieldRequired"
              />
            </div>
            <div class="col">
              <q-input
                v-model="variant.qty"
                type="number"
                label="Stocks"
                :rules="fieldRequired"
              />
            </div>
          </div>
          <q-btn
            unelevated
            class="q-my-md"
            color="primary"
            style="width: 100%; display: block"
            @click.prevent="saveVariant"
            >Save Variant</q-btn
          >
        </q-card-section>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
// import ProductVariant from "src/components/ProductVariant.vue";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";
import { fieldRequired } from "../helpers/fieldRules";
import { useProduct } from "../composable/products";
import { useLogs } from "../composable/activitylog";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { productCategories } from "src/helpers/categories";

// const variantModal = ref({ shown: false, type: "add", editId: null });
const $q = useQuasar();
const router = useRouter();

const logs = useLogs();
const products = useProduct();
const form = ref(null);
// const dataDir = ref(null);

const initialState = {
  id: products.value.length + 1,
  name: "",
  categories: [],
  description: "",
  unit: "",
  image: "",
  price: "",
  stocks: "",
  cost: "",
  lowLevelStock: "",
  variants: [],
};

// const variantInitialState = {
//   type: "",
//   price: "",
//   cost: "",
//   qty: 0,
// };

const productImage = reactive({ image: null, filename: "", img_data: null });
const productData = reactive({ ...initialState });
// const variant = reactive({ ...variantInitialState });

// const resetVariantForm = () => {
//   Object.assign(variant, variantInitialState);
// };

// const saveVariant = () => {
//   if (variantModal.value.type === "add") {
//     productData.variants.push({
//       ...variant,
//     });
//   }

//   if (variantModal.value.type === "update") {
//     productData.variants[variantModal.value.editId] = { ...variant };
//   }

//   resetVariantForm();
//   variantModal.value.shown = false;
// };

// const editVariant = (id) => {
//   Object.assign(variant, productData.variants[id]);
//   variantModal.value.shown = true;
//   variantModal.value.type = "update";
//   variantModal.value.editId = id;
// };

// const removeVariant = (index) => {
//   console.log("Received Index: ", index);
//   productData.variants.splice(index, 1);
//   $q.notify({
//     position: "top",
//     color: "green",
//     icon: "done_all",
//     message: "Product variant has been removed!",
//   });
// };

const saveProduct = async () => {
  await writeFile();

  products.value.unshift({
    ...productData,
    file: productImage.filename,
    path: productImage.path,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  logs.value.unshift({
    id: logs.value.length + 1,
    name: "Product Added",
    description: `Product ${productData.name} was recently added with an initial stocks of ${productData.stocks}.`,
    type: "added",
    productId: productData.id,
    createdAt: Date.now(),
  });

  $q.notify({
    position: "top",
    color: "green",
    icon: "done_all",
    message: "Product added successfully!",
  });

  router.push("/dashboard");
};

const mkdir = async () => {
  try {
    await Filesystem.mkdir({
      path: "products",
      directory: FilesystemDirectory.Documents,
      recursive: false,
    });
  } catch (e) {
    // alert("Unable to make directory", e);
  }
};

const writeFile = async () => {
  if (!productImage.img_data) return;

  try {
    await Filesystem.writeFile({
      path: `products/${productImage.filename}`,
      data: productImage.img_data,
      directory: FilesystemDirectory.Documents,
    });
  } catch (e) {
    console.log("Error: ", e);
  }
};

const onImageSelect = async (e) => {
  const file = e.target.files[0];
  productImage.image = file;

  const reader = new FileReader();

  reader.onloadend = function () {
    productImage.img_data = reader.result;
    console.log("Res: ", reader.result);
  };

  reader.readAsDataURL(file);

  const ext = productImage.image.name.split(".").pop();
  productImage.filename = new Date().getTime() + "." + ext;
};

onMounted(async () => {
  await mkdir();
});
</script>
