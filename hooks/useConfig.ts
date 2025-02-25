import ConfigContext from "@/contexts/ConfigContext";
import { useContext } from "react";

export function useConfig() {
  const value = useContext(ConfigContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useConfig must be wrapped in a <ConfigProvider />');
    }
  }

  return value;
}
