import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { ConfigProvider } from '@/providers/ConfigProvider';
import { ProvidersProvider } from '@/providers/ProvidersProvider';
import { useStorage } from '@/hooks/useStorage';
import { useEffect } from 'react';

export default function configLayout() {
  const { session, setShowMenu } = useSession();
  const { selectedSpace } = useStorage();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  useEffect(() => {
    setShowMenu(false);

    return () => {
      setShowMenu(true);
    }
  }, []);

  return (
    <ProvidersProvider selectedSpace={selectedSpace || 'config'}>
      <ConfigProvider>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="index" />
        </Stack>
      </ConfigProvider>
    </ProvidersProvider>
  );
}

