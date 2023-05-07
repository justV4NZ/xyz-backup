<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div class="q-mt-md">
      <p class="font-weight-bold text-h6">Activity Logs</p>
      <p>Shown on the table are all your activities</p>
      <q-table
        class="q-mt-md sticky-sales-table"
        flat
        title=""
        :columns="columns"
        :rows="logs"
        row-key="id"
        @row-click="viewDetails"
      />
    </div>

    <q-dialog v-model="detailsDialog" persistent>
      <q-card>
        <q-card-section class="col">
          <p class="text-h6">{{ selectedLog.name }}</p>
          <p>
            {{ moment(selectedLog.createdAt).format("MMMM Do YYYY, h:mm A") }}
          </p>
          <p class="q-mt-lg">
            TYPE:
            <q-chip>{{ selectedLog.type }}</q-chip>
          </p>
          <p class="q-mt-md text-body1 text-justify">
            {{ selectedLog.description }}
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { useLogs } from "../composable/activitylog";
import moment from "moment";
import { ref, reactive } from "vue";

const detailsDialog = ref(false);

let selectedLog = reactive({});
const logs = useLogs();

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
    label: "NAME",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "type",
    label: "TYPE",
    align: "left",
    field: (row) => row.type,
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

const viewDetails = (evt, row) => {
  selectedLog.id = row.id;
  selectedLog.type = row.type;
  selectedLog.name = row.name;
  selectedLog.description = row.description;
  detailsDialog.value = true;
  // console.log(selectedLog);
  // console.log("Viewing logs");
};
</script>
