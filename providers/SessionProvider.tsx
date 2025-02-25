import { useState, type PropsWithChildren } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { useStorageState, usePersistentState } from '@/hooks/useStorageState';

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [[isLoadingThreshold, threshold], _] = usePersistentState('threshold');
  const [pin,setPin] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sumBinaryValues = (values: string[]): number => {
    return values.reduce((acc, val) => acc + parseInt(val, 2), 0);
  };

  const validateAccess = (newPin: string[]): boolean => {
    const sum = sumBinaryValues(newPin);

    if(isLoadingThreshold) {
      return false; 
    } else if (!threshold) {
      return true;
    }

    return sum === threshold;
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession('locale');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        showMenu,
        setShowMenu,
        pin,
        setPin,
        error,
        setError,
        validateAccess
      }}>
      {children}
    </AuthContext.Provider>
  );
}

