import { useLocalStorage } from "./products";

export const useLogs = () => {
  return useLocalStorage("activitylog", []);
};
