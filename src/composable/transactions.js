import { useLocalStorage } from "./products";

export const useTransactions = () => {
  return useLocalStorage("transactions", []);
};
