import SpaceInterface from "@/interfaces/Space.interface";
import { createContext } from "react";

const StorageContext = createContext<{
 addSpace: () => void;
 archiveSpace: (spaceName: string) => void;
 spaces: SpaceInterface[];
 isLoadingSpaces: boolean;
 error: string | null;
 setError: React.Dispatch<React.SetStateAction<string | null>>,
 selectedSpace: string | null;
 setSelectedSpace: React.Dispatch<React.SetStateAction<string | null>>
}>({
  addSpace: () => {},
  archiveSpace: () => {},
  spaces: [],
  isLoadingSpaces: false,
  error: null,
  setError: () => {},
  selectedSpace: null,
  setSelectedSpace: () => {}
});

export default StorageContext;
