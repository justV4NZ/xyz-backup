import { ref, watch, onMounted } from "vue";

export const useLocalStorage = (key, defaultValue) => {
  const data = ref(defaultValue);

  const readData = () => {
    const v = localStorage.getItem(key);
    if (v) data.value = JSON.parse(v);
  };

  readData();

  onMounted(() => {
    window.addEventListener("storage", readData);
  });

  const write = () => {
    window.localStorage.setItem(key, JSON.stringify(data.value));
  };

  watch([data], write, { deep: true });

  return data;
};

export const useProduct = () => {
  return useLocalStorage("products", []);
};
