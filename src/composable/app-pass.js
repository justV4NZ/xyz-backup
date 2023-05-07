import { useLocalStorage } from "./products";

export const useAppPass = () => {
  return useLocalStorage("app-pass", []);
};
