<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div ref="summary">
      <div>
        <p class="text-h6">Sales Summary</p>
        <p class="text-weight-regular text-subtitle1">
          Here is your sales for your store.
        </p>
      </div>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card flat class="shadow-2 bg-primary text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Total Sales</p>
                <p class="text-h5 q-pt-sm">{{ formatCurrency(totalSales) }}</p>
              </q-card-section>
              <q-card-section>
                <q-icon name="payments" size="72px" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-gutter-sm" style="margin-top: 1px">
        <div class="col">
          <q-card flat class="shadow-2 bg-yellow-9 text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Weekly Sales</p>
                <p class="text-h6 q-pt-sm">{{ formatCurrency(weeklySales) }}</p>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat class="shadow-2 bg-yellow-9 text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Monthly Sales</p>
                <p class="text-h6 q-pt-sm">
                  {{ formatCurrency(monthlySales) }}
                </p>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card flat class="shadow-2 bg-primary text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Total Net Income</p>
                <p class="text-h5 q-pt-sm">{{ formatCurrency(netIncome) }}</p>
              </q-card-section>
              <q-card-section>
                <q-icon name="payments" size="72px" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-gutter-sm" style="margin-top: 1px">
        <div class="col">
          <q-card flat class="shadow-2 bg-yellow-9 text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Weekly Net</p>
                <p class="text-h6 q-pt-sm">{{ formatCurrency(weeklyNet) }}</p>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat class="shadow-2 bg-yellow-9 text-white q-px-sm">
            <q-card-section horizontal class="items-center row justify-between">
              <q-card-section>
                <p class="text-caption">Monthly Net</p>
                <p class="text-h6 q-pt-sm">
                  {{ formatCurrency(monthlyNet) }}
                </p>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="q-mt-md">
        <p class="font-weight-bold text-h6">Transactions</p>
        <p>Shown on the table are all your transactions</p>
        <q-table
          class="q-mt-md sticky-sales-table"
          flat
          title=""
          :columns="columns"
          :rows="transactions"
          row-key="name"
          @row-click="viewTransaction"
        />
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { computed } from "vue";
import { useTransactions } from "src/composable/transactions";
import { formatCurrency } from "../helpers/utilities";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();
const transactions = useTransactions();

const columns = [
  {
    name: "id",
    label: "ID",
    align: "left",
    field: (row) => padNumber(row.id),
    sortable: true,
  },
  {
    name: "totalitems",
    label: "ITEMS",
    align: "left",
    field: (row) => row.items.length,
    sortable: true,
  },
  {
    name: "deliveryfee",
    label: "DELIVERY FEE",
    align: "left",
    field: (row) => formatCurrency(row.deliveryFee),
    sortable: true,
  },
  {
    name: "netincome",
    label: "NET INCOME",
    align: "left",
    field: (row) => formatCurrency(row.netIncome),
    sortable: true,
  },
  {
    name: "totalamount",
    label: "TOTAL",
    align: "left",
    field: (row) => formatCurrency(row.totalAmount),
    sortable: true,
  },
  {
    name: "date",
    label: "DATE",
    align: "left",
    field: (row) => moment(row.createdAt).format("MMMM Do YYYY, h:mm A"),
    sortable: true,
  },
];

let totalSales = computed(() => {
  let total = 0;

  transactions.value.map((trans) => {
    if (trans.totalAmount) {
      total += parseFloat(trans.totalAmount);
    }
  });
  return total;
});

let netIncome = computed(() => {
  let total = 0;

  transactions.value.map((trans) => {
    if (trans.netIncome) {
      total += parseFloat(trans.netIncome);
    }
  });
  return total;
});

let weeklyNet = computed(() => {
  let total = 0;

  transactions.value.map((trans) => {
    if (trans.netIncome) {
      if (moment(trans.createdAt).isSameOrAfter(moment().subtract(1, "week"))) {
        total += parseFloat(trans.netIncome);
      }
    }
  });
  return total;
});

let monthlyNet = computed(() => {
  let total = 0;

  transactions.value.map((trans) => {
    if (trans.netIncome) {
      if (
        moment(trans.createdAt).isSameOrAfter(moment().subtract(1, "month"))
      ) {
        total += parseFloat(trans.netIncome);
      }
    }
  });
  return total;
});

const weeklySales = computed(() => {
  let weeklyTotal = 0;
  transactions.value.map((trans) => {
    if (trans.totalAmount) {
      if (moment(trans.createdAt).isSameOrAfter(moment().subtract(1, "week"))) {
        weeklyTotal += parseFloat(trans.totalAmount);
      }
    }
  });

  return weeklyTotal;
});

const monthlySales = computed(() => {
  let monthlyTotal = 0;

  transactions.value.map((trans) => {
    if (trans.totalAmount) {
      if (
        moment(trans.createdAt).isSameOrAfter(moment().subtract(1, "month"))
      ) {
        monthlyTotal += parseFloat(trans.totalAmount);
      }
    }
  });

  return monthlyTotal;
});

const padNumber = (val) => val.toString().padStart(6, 0);

//es-lint-no-unused-var
const viewTransaction = (evt, row) => {
  router.push(`/transaction/${row.id}`);
};
</script>

<style lang="scss">
.sticky-sales-table {
  max-width: 600px;

  & thead tr:first-child th:first-child {
    /* bg color is important for th; just specify one */
    background-color: #fff;
  }
  & td:first-child {
    background-color: #dce3f5;
  }
  & th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}
</style>
