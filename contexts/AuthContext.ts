import { createContext } from "react";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  pin: string[];
  setPin: React.Dispatch<React.SetStateAction<string[]>>,
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  validateAccess: () => boolean
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  pin: [],
  setPin: () => {},
  error: null,
  setError: () => {},
  validateAccess: () => false
});

export default AuthContext;
