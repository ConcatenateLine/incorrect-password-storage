import { useEffect, useState, type PropsWithChildren } from 'react';
import { usePersistentState } from '@/hooks/useStorageState';
import StorageContext from '@/contexts/StorageContext';
import SpaceInterface from '@/interfaces/Space.interface';
import { generateRedOrangeHexColor } from '@/utils/GenerateRandomColor';

export function StorageProvider({ children }: PropsWithChildren) {
  const [[isLoadingSpaces, spaces], setSpaces] = usePersistentState<SpaceInterface[]>('spaces');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSpace = (space: SpaceInterface) => {
    if (spaces) {
      const newSpaces = [...spaces, space];
      setSpaces(newSpaces);
    } else {
      setSpaces([space]);
    }
  };

  const archiveSpace = (spaceName: string) => {
    if (spaces) {
      const filteredAccounts = spaces.filter((s) => s.name !== spaceName);
      setSpaces(filteredAccounts);
    }
    setSelectedSpace(null);
  };

  useEffect(() => {
    if (!isLoadingSpaces && !spaces) {
      setSpaces([
        {
          state: 'active',
          name: 'Default',
          color: generateRedOrangeHexColor(),
        }
      ]);
    }
  }, [isLoadingSpaces])

  return (
    <StorageContext.Provider
      value={{
        addSpace: () => {
          if (spaces && spaces.length > 4) {
            alert('You can only have 5 spaces');
          } else {
            const spaceName = generateRedOrangeHexColor();
            addSpace({
              state: 'active',
              name: spaceName,
              color: spaceName,
            });
          }
        },
        archiveSpace: (spaceName: string) => {
          archiveSpace(spaceName)
        },
        spaces: spaces ?? [],
        isLoadingSpaces,
        error,
        setError,
        selectedSpace,
        setSelectedSpace,
      }}>
      {children}
    </StorageContext.Provider>
  );
}
