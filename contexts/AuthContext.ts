import { createContext } from "react";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  pin: string[];
  setPin: React.Dispatch<React.SetStateAction<string[]>>,
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  validateAccess: (newPin: string[]) => boolean
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  showMenu: false,
  setShowMenu: () => {},
  pin: [],
  setPin: () => {},
  error: null,
  setError: () => {},
  validateAccess: () => false
});

export default AuthContext;
