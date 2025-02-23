import StorageContext from "@/contexts/StorageContext";
import { useContext } from "react";

export function useStorage() {
  const value = useContext(StorageContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('use Storage must be wrapped in a <StorageProvider />');
    }
  }

  return value;
}
