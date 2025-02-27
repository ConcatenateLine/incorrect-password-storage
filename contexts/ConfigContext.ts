import { createContext } from "react";

const ConfigContext = createContext<{
  threshold: number;
  pin: string[];
  setPin: React.Dispatch<React.SetStateAction<string[]>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  changeAccess: (newPin: string[]) => boolean,
  layout: string,
  changeLayout: (layout: string) => void
}>({
  threshold: 0,
  pin: [],
  setPin: () => {},
  error: null,
  setError: () => {},
  changeAccess: () => false,
  layout: 'default',
  changeLayout: () => {}
});

export default ConfigContext;
