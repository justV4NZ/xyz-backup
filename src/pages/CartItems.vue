<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div ref="cartitems" class="q-pb-fragment">
      <div class="row justify-between q-mt-sm">
        <p class="text-weight-bold">Transaction #:</p>
        <p>{{ padNumber(transactions.length) }}</p>
      </div>
      <div class="row justify-between">
        <p class="text-weight-bold">Date:</p>
        <p>{{ currentDate }}</p>
      </div>

      <hr class="q-mt-lg q-mb-md" />

      <div class="q-mt-md">
        <q-table
          class="sticky-price-table"
          hide-bottom
          flat
          title=""
          :columns="columns"
          :rows="cart"
          row-key="name"
        >
          <template #body-cell-actions="props">
            <q-td key="actions">
              <q-btn
                unelevated
                icon="edit"
                size="20"
                text-color="primary"
                @click.prevent="
                  selectedProduct = JSON.parse(JSON.stringify(props.row));
                  updateProductModal = true;
                "
              />
              <q-btn
                unelevated
                icon="delete"
                size="20"
                text-color="red"
                @click.prevent="
                  productID = props.row.id;
                  removeProductModal = true;
                "
              />
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="row">
        <div class="col-5"></div>
        <div class="col-7">
          <div class="row justify-between">
            <p class="text-right q-mt-sm q-mr-sm text-weight-bold">
              Delivery Fee: &nbsp;
            </p>
            <p class="text-right q-mt-sm q-mr-sm">
              {{ formatCurrency(transactionData.deliveryFee) }}
            </p>
          </div>
          <div class="row justify-between">
            <p class="text-right q-mt-sm q-mr-sm text-weight-bold">
              Sub Total: &nbsp;
            </p>
            <p class="text-right q-mt-sm q-mr-sm">
              {{ formatCurrency(subTotal) }}
            </p>
          </div>
          <div class="row justify-between">
            <p class="text-right q-mt-sm q-mr-sm text-weight-bold">
              Grand Total: &nbsp;
            </p>
            <p class="text-right q-mt-sm q-mr-sm">
              {{ formatCurrency(grandTotal) }}
            </p>
          </div>
        </div>
      </div>

      <hr class="q-mt-lg q-mb-md" />

      <div>
        <p class="text-weight-bold text-h6">Cart Options</p>
        <p>Here are some other options you can do</p>
        <div class="row q-mt-sm no-wrap">
          <div class="col-4">
            <div
              class="column bg-primary text-white justify-center items-center q-pa-md rounded-borders q-mr-sm"
              @click="router.push('/point-of-sales/products')"
            >
              <q-icon size="18px" name="add_shopping_cart" />
              <p class="q-mt-sm">Add Item</p>
            </div>
          </div>
          <!-- <div class="col-4">
            <div
              class="column bg-primary text-white justify-center items-center q-pa-md rounded-borders q-mr-sm"
            >
              <q-icon size="18px" name="loyalty" />
              <p class="q-mt-sm">Discount</p>
            </div>
          </div> -->
          <div class="col-4">
            <div
              class="column bg-primary text-white justify-center items-center q-pa-md rounded-borders q-mr-sm"
              @click="deliveryFeeModal = true"
            >
              <q-icon size="18px" name="local_shipping" />
              <p class="q-mt-sm">Delivery</p>
            </div>
          </div>
        </div>
      </div>

      <hr class="q-mt-lg q-mb-md" />

      <div class="q-pb-md q-pt-sm">
        <p class="text-weight-bold text-h6">
          Customer Details <span class="text-caption">(Optional)</span>
        </p>
        <p>Here are some other options you can do</p>
        <div class="q-mt-md">
          <q-input v-model="transactionData.name" label="Full Name"></q-input>
          <q-input
            v-model="transactionData.contact_number"
            label="Contact Number"
          ></q-input>
          <q-input
            v-model="transactionData.deliveryAddress"
            label="Delivery Address"
          ></q-input>
        </div>
      </div>

      <hr class="q-mt-lg q-mb-lg" />

      <div>
        <p class="text-weight-bold text-h6">
          Transaction Notes <span class="text-caption">(Optional)</span>
        </p>
        <p>Add some notes if necessary</p>
        <div>
          <q-input
            v-model="transactionData.notes"
            type="textarea"
            auto-grow
            label="Transaction Notes"
          ></q-input>
        </div>
      </div>
    </div>

    <q-dialog
      v-model="checkoutModal"
      position="bottom"
      class=""
      @hide="summary = true"
    >
      <q-card class="full-width fragment-radius">
        <q-linear-progress :value="1" color="green" />
        <q-card-section class="">
          <div class="text-caption">
            <div class="text-weight-bold text-h6">Amount Payable</div>
            <div class="">Enter the amount tendered by the user</div>
          </div>
          <div class="row justify-between q-mt-md">
            <p class="text-weight-bold">Total Amount</p>
            <p>{{ formatCurrency(grandTotal) }}</p>
          </div>
          <div>
            <q-form ref="checkoutForm">
              <q-input
                v-model="transactionData.amountReceived"
                label="Amount Received"
                :rules="amountReceived"
              />
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-sm q-mt-md">
          <q-btn flat label="Close" color="gray" :disable="isBtnLoading" />
          <q-btn
            flat
            label="Checkout"
            color="primary"
            :disable="isBtnLoading || checkoutBtnDisabled"
            @click="checkoutTransaction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="summary" seamless position="bottom" class="">
      <q-card
        class="full-width fragment-radius"
        @click.prevent="proceedCheckout"
      >
        <q-linear-progress :value="0.8" color="green" />
        <q-card-section class="row items-center no-wrap q-pt-sm q-pb-md">
          <div class="text-caption">
            <div class="text-weight-bold text-h6">Proceed Checkout</div>
            <div class="">Grand Total: {{ formatCurrency(grandTotal) }}</div>
          </div>
          <q-space />
          <q-btn flat round icon="arrow_forward" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="removeProductModal" class="">
      <q-card class="full-width fragment-radius">
        <q-card-section class="q-pt-md q-pb-md">
          <div class="text-weight-bold text-h6">Confirm Delete</div>
          <div class="">
            Are you sure you want to remove this product from your cart?
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-sm q-mt-md">
          <q-btn
            flat
            label="Cancel"
            color="gray"
            @click="removeProductModal = false"
          />
          <q-btn
            flat
            label="Confirm"
            color="red"
            :disable="isBtnLoading"
            @click="removeProduct"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="updateProductModal">
      <q-card class="full-width">
        <q-card-section class="q-py-sm q-mt-sm">
          <div class="q-mb-md">
            <p class="text-h6 text-weight-bold">Update Product</p>
            <p>Update the quantity to be bought</p>
          </div>
          <q-form ref="cartModalForm">
            <q-input
              v-model="selectedProduct.qty"
              label="Quantity"
              :rules="[maxQuantity]"
            />
          </q-form>
          <p>Max Quantity: {{ selectedProduct.maxQty }}</p>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-sm q-mt-md">
          <q-btn v-close-popup flat label="Cancel" color="primary" />
          <q-btn
            flat
            label="Update"
            color="green"
            :loading="isBtnLoading"
            @click.prevent="updateCart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deliveryFeeModal" class="">
      <q-card class="full-width fragment-radius">
        <q-card-section class="q-pt-sm q-pb-md">
          <div class="text-caption">
            <div class="text-weight-bold text-h6">Delivery</div>
            <div class="">
              Please set the price and delivery address for the customer
            </div>
            <div class="q-mt-md">
              <q-form ref="deliveryForm" @submit="setDelivery">
                <q-input
                  type="number"
                  step="any"
                  v-model="orderDelivery.deliveryFee"
                  label="Delivery Fee"
                  :rules="fieldRequired"
                ></q-input>
                <q-input
                  v-model="orderDelivery.deliveryAddress"
                  type="textarea"
                  label="Delivery Address"
                  :rules="fieldRequired"
                  autogrow
                ></q-input>
              </q-form>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-sm q-mt-md">
          <q-btn
            flat
            label="Close"
            color="gray"
            :disable="isBtnLoading"
            @click="deliveryFeeModal = false"
          />
          <q-btn
            flat
            label="Save"
            color="green"
            :disable="isBtnLoading"
            @click="deliveryForm.submit()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, computed, reactive } from "vue";
import { formatCurrency } from "../helpers/utilities";
import { useCart } from "src/composable/cart";
import { useTransactions } from "src/composable/transactions";
import { useProduct } from "src/composable/products";
import { useLogs } from "../composable/activitylog";
import { fieldRequired } from "src/helpers/fieldRules";
import moment from "moment";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();

const orderDelivery = reactive({
  deliveryFee: 0,
  deliveryAddress: "",
});

const setDelivery = () => {
  transactionData.deliveryFee = orderDelivery.deliveryFee;
  transactionData.deliveryAddress = orderDelivery.deliveryAddress;
  deliveryFeeModal.value = false;
  $q.notify({
    position: "top",
    color: "green",
    icon: "done_all",
    message: "Delivery has been set",
  });
};

const transactionData = reactive({
  name: "",
  contact_number: "",
  address: "",
  notes: "",
  deliveryFee: 0,
  deliveryAddress: "",
  amountReceived: 0,
});

const $q = useQuasar();

const productID = ref(null);
const removeProductModal = ref(false);
let selectedProduct = ref({ quantity: null, id: null, maxQuantity: 0 });
const updateProductModal = ref(false);
const deliveryFeeModal = ref(false);
const checkoutModal = ref(false);
const summary = ref(true);
const isBtnLoading = ref(false);
const deliveryForm = ref(false);
const checkoutBtnDisabled = ref(false);
const logs = useLogs();
const checkoutForm = ref("");

const columns = [
  {
    name: "actions",
    label: "Actions",
    align: "center",
    sortable: false,
  },
  {
    name: "name",
    label: "Product",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "price",
    label: "PRICE",
    align: "left",
    field: (row) => formatCurrency(row.price),
    sortable: true,
  },
  {
    name: "qty",
    label: "QTY",
    align: "left",
    field: (row) => row.qty,
    sortable: true,
  },
  {
    name: "total",
    label: "TOTAL",
    align: "left",
    field: (row) => formatCurrency(row.total),
    sortable: true,
  },
];

const cart = useCart();
const products = useProduct();
const transactions = useTransactions();

const currentDate = moment().format("MMMM Do YYYY, h:mm A");

const removeProduct = () => {
  console.log("hi");
  let index = null;
  cart.value.map((item, i) => {
    if (item.id == productID.value) {
      index = i;
    }
  });

  if (index !== null) {
    cart.value.splice(index, 1);
  }

  removeProductModal.value = false;
};

let subTotal = computed(() => {
  let total = 0;
  cart.value.map((item) => {
    if (item.total) {
      total += item.total;
    }
  });

  return total;
});

let grandTotal = computed(
  () =>
    parseFloat(subTotal.value) + parseFloat(transactionData.deliveryFee ?? 0)
);

const padNumber = (val) => val.toString().padStart(6, 0);

const amountReceived = [
  (v) =>
    (v && parseFloat(v) >= parseFloat(grandTotal.value)) ||
    `Amount should be equal or greater than ${formatCurrency(
      grandTotal.value
    )}`,
];

const checkoutTransaction = () => {
  checkoutForm.value.validate().then((success) => {
    if (success) {
      isBtnLoading.value = true;
      let netIncome = 0;

      cart.value.map((item) => {
        products.value.map((prod) => {
          if (prod.id == item.id) {
            prod.stocks = parseInt(prod.stocks) - parseInt(item.qty);
            netIncome +=
              (parseFloat(prod.price) - parseFloat(prod.cost)) *
              parseInt(item.qty);
          }
        });
      });

      /**
       *  Add net income of transaction
       */

      transactions.value.unshift({
        id: transactions.value.length + 1,
        ...transactionData,
        totalAmount: grandTotal.value,
        change:
          parseFloat(transactionData.amountReceived) -
          parseFloat(grandTotal.value),
        netIncome: netIncome + parseFloat(transactionData.deliveryFee),
        items: [...cart.value],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      logs.value.unshift({
        id: logs.value.length + 1,
        name: "Transaction Successful",
        type: "sales",
        description: `Transaction ID: ${
          transactions.value.length + 1
        }. You have successfully sold ${
          cart.value.length
        } items with a total amount of ${grandTotal.value}.`,
        createdAt: Date.now(),
      });

      setTimeout(() => {
        $q.notify({
          position: "top",
          color: "green",
          icon: "done_all",
          message: "Transaction is successful!",
        });

        cart.value = [];
        isBtnLoading.value = false;

        router.push("/dashboard");
      }, 1000);
    } else {
      $q.notify({
        position: "top",
        color: "red",
        icon: "done_all",
        message: "Error! Please check the amount tendered",
      });
    }
  });
};

const proceedCheckout = () => {
  if (cart.value.length == 0) {
    $q.notify({
      position: "top",
      color: "red",
      icon: "done_all",
      message: "Error! No Items to checkout",
    });
  } else {
    summary.value = false;
    checkoutModal.value = true;
  }
};

const maxQuantity = (v) => {
  const maxQty = parseInt(selectedProduct.value.maxQty);
  if (parseInt(v) > maxQty) {
    return "Insufficient stocks. Please lower your quantity";
  }
};

const updateCart = () => {
  cart.value.map((item, i) => {
    if (item.id == selectedProduct.value.id) {
      cart.value[i].qty = selectedProduct.value.qty;
      cart.value[i].total =
        selectedProduct.value.qty * parseFloat(selectedProduct.value.price);
    }
  });

  updateProductModal.value = false;
};
</script>

<style lang="scss">
.sticky-price-table {
  max-width: 600px;

  & thead tr:last-child th:last-child {
    /* bg color is important for th; just specify one */
    background-color: #fff;
  }
  & td:last-child {
    background-color: #dce3f5;
  }
  & th:last-child,
  td:last-child {
    position: sticky;
    right: 0;
    z-index: 1;
  }
}
</style>
