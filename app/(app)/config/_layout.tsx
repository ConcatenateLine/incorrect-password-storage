import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { ConfigProvider } from '@/providers/ConfigProvider';
import { useEffect } from 'react';

export default function configLayout() {
  const { session, setShowMenu } = useSession();

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
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="index" />
    </Stack>);
}

