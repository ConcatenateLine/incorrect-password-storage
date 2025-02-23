import ProvidersContext from "@/contexts/ProvidersContext";
import { useContext } from "react";

export function useProviders() {
  const value = useContext(ProvidersContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('use Storage must be wrapped in a <ProvidersProvider />');
    }
  }

  return value;
}
