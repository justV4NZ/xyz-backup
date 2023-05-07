import { useLocalStorage } from "./products";

export const useCart = () => {
  return useLocalStorage("cart", []);
};
