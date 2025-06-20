import ProviderInterface, { AccountInterface } from "@/interfaces/Provider.interface";
import { createContext } from "react";

const ProvidersContext = createContext<{
  addAccount: (username: string, password: string) => boolean;
  archiveAccount: (id: string,username: string) => void;
  showPassword: (password: string) => string;
  providers: ProviderInterface[];
  isLoadingProviders: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  editAccount: (id: string, username: string, password: string) => boolean,
  editingAccount: AccountInterface | null,
  setEditingAccount: React.Dispatch<React.SetStateAction<AccountInterface | null>>,
  exportToJson: () => Promise<boolean>
}>({
  addAccount: () => false,
  archiveAccount: () => { },
  showPassword: () => '',
  providers: [],
  isLoadingProviders: false,
  error: null,
  setError: () => {},
  editAccount: () => false,
  editingAccount: null,
  setEditingAccount: () => {},
  exportToJson: async () => false
});

export default ProvidersContext;
