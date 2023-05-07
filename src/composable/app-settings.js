import { useLocalStorage } from "./products";

export const useAppSettings = () => {
  return useLocalStorage("app-settings", []);
};
