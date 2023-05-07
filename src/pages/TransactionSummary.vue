<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div ref="cartitems" class="q-pb-fragment">
      <div class="row justify-between q-mt-sm">
        <p class="text-weight-bold">Transaction #:</p>
        <p>{{ padNumber(transactionData.id) }}</p>
      </div>
      <div class="row justify-between">
        <p class="text-weight-bold">Date:</p>
        <p>{{ formatDate(transactionData.createdAt) }}</p>
      </div>

      <hr class="q-mt-lg q-mb-md" />

      <div class="q-mt-md">
        <q-table
          class="sticky-price-table"
          hide-bottom
          flat
          title=""
          :columns="columns"
          :rows="transactionData.items"
          row-key="name"
        />
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
              Total Amount: &nbsp;
            </p>
            <p class="text-right q-mt-sm q-mr-sm">
              {{ formatCurrency(transactionData.totalAmount) }}
            </p>
          </div>
          <div class="row justify-between">
            <p class="text-right q-mt-sm q-mr-sm text-weight-bold">
              Amount Tendered: &nbsp;
            </p>
            <p class="text-right q-mt-sm q-mr-sm">
              {{ formatCurrency(transactionData.amountReceived) }}
            </p>
          </div>
          <div class="row justify-between">
            <p class="text-right q-mt-sm q-mr-sm text-weight-bold">
              Change: &nbsp;
            </p>
            <p class="text-right q-mt-sm q-mr-sm">
              {{ formatCurrency(transactionData.change) }}
            </p>
          </div>
        </div>
      </div>

      <hr class="q-mt-lg q-mb-md" />

      <div class="q-pb-md q-pt-sm">
        <p class="text-weight-bold text-h6">
          Customer Details <span class="text-caption">(Optional)</span>
        </p>
        <p>Here is the info for your customer</p>
        <div class="q-mt-md">
          <q-input
            v-model="transactionData.name"
            label="Full Name"
            readonly
          ></q-input>
          <q-input
            v-model="transactionData.contact_number"
            label="Contact Number"
            readonly
          ></q-input>
          <q-input
            v-model="transactionData.address"
            label="Address"
            readonly
          ></q-input>
        </div>
      </div>

      <hr class="q-mt-lg q-mb-lg" />

      <div>
        <p class="text-weight-bold text-h6">
          Delivery <span class="text-caption">(Optional)</span>
        </p>
        <p>Delivery address added</p>
        <div>
          <q-input
            v-model="transactionData.deliveryAddress"
            type="textarea"
            auto-grow
            label="Delivery Address"
            readonly
          ></q-input>
        </div>
      </div>

      <hr class="q-mt-lg q-mb-lg" />

      <div>
        <p class="text-weight-bold text-h6">
          Transaction Notes <span class="text-caption">(Optional)</span>
        </p>
        <p>Notes for this transaction</p>
        <div>
          <q-input
            v-model="transactionData.notes"
            type="textarea"
            auto-grow
            label="Transaction Notes"
            readonly
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
        <q-linear-progress :value="1" color="blue" />
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
      <q-card class="full-width fragment-radius">
        <q-linear-progress :value="1" color="blue" />
        <q-card-section class="row items-center no-wrap q-pt-sm q-pb-md">
          <div class="text-caption">
            <div class="text-weight-bold text-h6">Transaction Total</div>
            <div class="">
              Total Amount: {{ formatCurrency(transactionData.totalAmount) }}
            </div>
          </div>
          <q-space />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { formatCurrency } from "../helpers/utilities";
import { useTransactions } from "src/composable/transactions";
import moment from "moment";
import { useRoute } from "vue-router";

const transactionData = reactive({
  name: "",
  contact_number: "",
  address: "",
  notes: "",
  deliveryFee: 0,
  deliveryAddress: "",
  amountReceived: 0,
});

const route = useRoute();
const checkoutModal = ref(false);
const summary = ref(true);

const columns = [
  {
    name: "id",
    label: "ID",
    align: "left",
    field: (row) => row.id,
    sortable: true,
  },
  {
    name: "name",
    label: "PRODUCT",
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

const transactions = useTransactions();

onMounted(() => {
  transactions.value.map((transaction, index) => {
    if (transaction.id == route.params.id) {
      Object.assign(transactionData, transactions.value[index]);
    }
  });
});

const padNumber = (val) => val && val.toString().padStart(7, 0);

const formatDate = (val) => {
  return moment(val).format("MMMM Do YYYY, h:mm A");
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
