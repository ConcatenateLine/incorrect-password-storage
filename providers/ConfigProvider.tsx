import { useState, type PropsWithChildren } from 'react';
import ConfigContext from '@/contexts/ConfigContext';
import { usePersistentState } from '@/hooks/useStorageState';

export function ConfigProvider({ children }: PropsWithChildren) {
  const [[isLoadingLayout, layout], setLayout] = usePersistentState<string>('default');
  const [[isLoadingThreshold, threshold], setThreshold] = usePersistentState('threshold');

  const [pin,setPin] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sumBinaryValues = (values: string[]): number => {
    return values.reduce((acc, val) => acc + parseInt(val, 2), 0);
  };

  const changeAccess = (newPin: string[]): boolean => {
    const sum = sumBinaryValues(newPin);

    if(isLoadingThreshold) {
      return false; 
    }

    setThreshold(sum);
    return true;
  };

  const changeLayout = (newlayout: string): boolean => {
    if(isLoadingLayout) {
      return false; 
    }

    setLayout(newlayout);
    return true;
  }

  return (
    <ConfigContext.Provider
      value={{
        threshold: Number(threshold) || 4,
        pin,
        setPin,
        error,
        setError,
        changeAccess,
        layout: layout || 'default',
        changeLayout
      }}>
      {children}
    </ConfigContext.Provider>
  );
}

