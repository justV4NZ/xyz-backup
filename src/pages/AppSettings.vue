<template>
  <q-page class="q-pa-md md:q-pa-sm">
    <div>
      <p class="text-h6">Business Info</p>
      <p class="text-weight-regular text-caption">
        Set your business information
      </p>
    </div>
    <q-separator class="q-mt-md" />

    <div class="q-gutter-sm q-mt-md">
      <q-input
        v-model="data.storeName"
        outlined
        label="Store Name"
        :rule="fieldRequired"
      />
      <q-input
        v-model="data.address"
        outlined
        label="Store Address"
        :rule="fieldRequired"
      />
      <q-input
        v-model="data.storeContact"
        type="number"
        outlined
        step="any"
        label="Business Number"
        :rule="fieldRequired"
      />
      <div class="q-gutter-sm row q-mx-none q-mt-none">
        <div class="col">
          <q-input
            v-model="data.openingHour"
            outlined
            mask="time"
            :rules="['time']"
            label="Opening"
          >
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="data.openingHour">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col">
          <q-input
            v-model="data.closingHour"
            outlined
            mask="time"
            :rules="['time']"
            label="Closing"
          >
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="data.closingHour">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <div class="q-mt-sm">
      <p class="text-h6">Store Owner</p>
      <p class="text-weight-regular text-caption">Store owner information</p>
    </div>

    <q-separator class="q-mt-md" />

    <div class="q-gutter-sm q-mt-md">
      <q-input
        v-model="data.owner"
        outlined
        label="Full Name"
        :rule="fieldRequired"
      />
      <q-input
        v-model="data.ownerContact"
        type="number"
        step="any"
        outlined
        :rules="[(v) => v.length <= 11 || 'Length must not be greater than 11']"
        hide-bottom-space=""
        label="Contact Number"
      />
      <q-input
        v-model="data.ownerEmail"
        :rule="fieldRequired"
        outlined
        label="Email Address"
      />
      <q-input
        v-model="data.ownerAddress"
        :rule="fieldRequired"
        outlined
        label="Address"
      />
      <q-select
        v-model="data.ownerGender"
        :options="['Male', 'Female', 'Others']"
        outlined
        label="Gender"
        :rule="fieldRequired"
        clearable
      />
    </div>
    <div class="row justify-end q-mt-sm q-gutter-sm">
      <q-btn
        unelevated
        color="primary"
        :loading="isBtnLoading"
        @click.prevent="saveSettings"
        >Update Data</q-btn
      >
    </div>

    <div>
      <div class="q-mt-sm">
        <p class="text-h6">App Password</p>
        <p class="text-weight-regular text-caption">
          Set your password upon opening the application
        </p>
      </div>

      <q-form ref="passForm" @submit="updatePassword">
        <q-separator class="q-mt-md" />
        <div class="q-gutter-sm q-mt-md">
          <q-input
            v-model="password.current"
            :rules="fieldRequired"
            type="password"
            label="Current Password"
            hide-bottom-space
            outlined
          ></q-input>
          <q-input
            v-model="password.new"
            :rules="fieldRequired"
            type="password"
            label="New Password"
            hide-bottom-space
            outlined
          ></q-input>
          <q-input
            v-model="password.confirm"
            :rules="fieldRequired"
            type="password"
            label="Confirm Password"
            hide-bottom-space
            outlined
          ></q-input>
        </div>

        <div class="row justify-end q-mt-sm q-gutter-sm">
          <q-btn
            type="submit"
            unelevated
            color="primary"
            :loading="isBtnLoading"
            >Update Password</q-btn
          >
        </div>
      </q-form>
    </div>

    <div class="q-mt-sm">
      <p class="text-h6">Reset Data</p>
      <p class="text-weight-regular text-caption">Clear application data</p>
    </div>

    <q-separator class="q-mt-md" />

    <div class="row justify-between items-center q-mt-md">
      <div class="row">
        <div class="col">
          <p>Resets all data including products, sales, and config</p>
        </div>
        <q-btn
          unelevated
          color="primary"
          :disable="isBtnLoading"
          @click.prevent="resetModalShown = true"
          >Everything</q-btn
        >
      </div>
    </div>
    <div class="row justify-between items-center q-mt-md">
      <div class="col">
        <p>Reset only the config data</p>
      </div>
      <q-btn
        unelevated
        color="primary"
        :disable="isBtnLoading"
        @click.prevent="resetConfigModal = true"
        >Only Config</q-btn
      >
    </div>

    <q-btn
      unelevated=""
      class="block full-width q-mt-xl"
      label="Lock App"
      color="primary"
      @click.prevent="logout"
    />

    <q-dialog v-model="resetModalShown" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <p class="q-ml-sm text-h6 q-mb-sm">Reset Data</p>
          <span class="q-ml-sm"
            >This will reset everything including products and user data.
            <span class="text-red"
              >Are you sure you want to proceed?</span
            ></span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            :disable="isBtnLoading"
            label="Cancel"
            color="primary"
          />
          <q-btn
            flat
            label="Proceed"
            color="red"
            :loading="isBtnLoading"
            @click.prevent="resetData"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="resetConfigModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <p class="q-ml-sm text-h6 q-mb-sm">Reset Data</p>
          <span class="q-ml-sm"
            >This will only reset your application settings and other data will
            not be cleared
            <span class="text-black"
              >Are you sure you want to proceed?</span
            ></span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            :disable="isBtnLoading"
            flat
            label="Cancel"
            color="red"
          />
          <q-btn
            flat
            label="Proceed"
            color="red"
            :loading="isBtnLoading"
            @click.prevent="resetConfigData"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue";
import { useAppSettings } from "src/composable/app-settings";
import { fieldRequired } from "src/helpers/fieldRules";
import { useLogs } from "../composable/activitylog";
import { useQuasar } from "quasar";
import { useAppPass } from "src/composable/app-pass";
import { useRouter } from "vue-router";

const resetModalShown = ref(false);
const resetConfigModal = ref(false);
const isBtnLoading = ref(false);
const passForm = ref("");
const router = useRouter();
const password = reactive({ current: null, new: null, confirm: null });

const appPass = useAppPass();
const appSettings = useAppSettings();
const logs = useLogs();
const $q = useQuasar();

const data = reactive({
  storeName: "",
  address: "",
  storeContact: "",
  owner: "",
  ownerEmail: "",
  ownerContact: "",
  ownerGender: "",
  ownerAddress: "",
});

onMounted(() => {
  Object.assign(data, appSettings.value);
});

const updatePassword = () => {
  isBtnLoading.value = true;
  if (appPass.value.length == 0) {
    if (password.current != "0000") {
      $q.notify({
        position: "top",
        color: "red",
        icon: "error",
        message: "Current Password is incorrect",
      });
    } else {
      savePass();
    }
  } else {
    if (appPass.value[0].password != password.current) {
      $q.notify({
        position: "top",
        color: "red",
        icon: "error",
        message: "Current Password is incorrect",
      });
    } else {
      savePass();
    }
  }
  setTimeout(() => {
    isBtnLoading.value = false;
  }, 1000);
};

const savePass = () => {
  if (password.new !== password.confirm) {
    $q.notify({
      position: "top",
      color: "red",
      icon: "error",
      message: "New and Confirm Password doesn't match",
    });
  } else {
    appPass.value[0] = {
      password: password.new,
      authenticated: true,
    };
    $q.notify({
      position: "top",
      color: "green",
      icon: "done_all",
      message: "Password has been updated successfully!",
    });
  }

  // console.log(passForm.value);
  password.confirm = "";
  password.current = "";
  password.new = "";
  passForm.value.resetValidation();
  passForm.value.reset();
};
const saveSettings = () => {
  isBtnLoading.value = true;
  appSettings.value = { ...data };

  logs.value.unshift({
    id: logs.value.length + 1,
    name: "Settings Updated",
    type: "updated",
    description: `You have made some changes to your settings.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  setTimeout(() => {
    isBtnLoading.value = false;
    $q.notify({
      position: "top",
      color: "green",
      icon: "done_all",
      message: "Settings saved successfully!",
    });
  }, 1000);
};

const resetData = () => {
  isBtnLoading.value = true;
  localStorage.removeItem("products");
  localStorage.removeItem("app-settings");
  localStorage.removeItem("activitylog");
  localStorage.removeItem("transactions");
  setTimeout(() => {
    isBtnLoading.value = false;
    resetModalShown.value = false;
  }, 1500);
};

const resetConfigData = () => {
  isBtnLoading.value = true;
  localStorage.removeItem("app-settings");
  setTimeout(() => {
    isBtnLoading.value = false;
    resetConfigModal.value = false;
  }, 1000);
};

const logout = () => {
  appPass.value[0].authenticated = false;
  router.push("/authenticate");
};
</script>
