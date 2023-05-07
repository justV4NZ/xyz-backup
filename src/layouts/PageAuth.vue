<template>
  <div class="page-auth">
    <img src="../assets/images/Auth_logo.png" alt="main logo" />
    <q-form
      ref="form"
      class="column items-center justify-center text-center"
      @submit.prevent="authenticate"
    >
      <p class="text-h6">Enter your password</p>
      <p class="q-px-xl">
        To prevent any problems within your data we require you to enter your
        password
      </p>
      <q-input
        v-model.trim="pass"
        type="password"
        outlined
        dense
        filled
        class="q-mt-md"
        input-class="text-center text-white"
        :rule="fieldRequired"
      />
      <q-btn type="submit" unelevated color="primary" class="q-mt-md"
        >Proceed</q-btn
      >
    </q-form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { fieldRequired } from "../helpers/fieldRules";
import { useRouter } from "vue-router";
import { useAppPass } from "../composable/app-pass";
import { useQuasar } from "quasar";

const appPass = useAppPass();

const router = useRouter();

let pass = ref("");
let form = ref("");

const $q = useQuasar();
const authenticate = async () => {
  const validated = await form.value.validate();

  if (!validated) return;

  if (appPass.value.length == 0) {
    if (pass.value === "0000") {
      router.push("/dashboard");
    } else {
      $q.notify({
        position: "top",
        color: "red",
        icon: "error",
        message: "Password entered is invalid",
      });
    }
  }

  if (appPass.value.length == 0) {
    if (pass.value != "0000") {
      $q.notify({
        position: "top",
        color: "red",
        icon: "error",
        message: "Password is incorrect",
      });
    } else {
      appPass.value[0] = {
        password: appPass.value[0]?.password ?? "0000",
        authenticated: true,
      };
      router.push("/dashboard");
    }
  } else {
    if (appPass.value[0].password != pass.value) {
      $q.notify({
        position: "top",
        color: "red",
        icon: "error",
        message: "Password is incorrect",
      });
    } else {
      appPass.value[0] = {
        password: appPass.value[0]?.password ?? "0000",
        authenticated: true,
      };
      router.push("/dashboard");
    }
  }

  // if(pass.value == appPass.value)
};
</script>
