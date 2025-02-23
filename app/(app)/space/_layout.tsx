import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { ProvidersProvider } from '@/providers/ProvidersProvider';
import { useStorage } from '@/hooks/useStorage';

export default function SpaceLayout() {
  const { session, isLoading } = useSession();
  const { selectedSpace } = useStorage();

  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <ProvidersProvider selectedSpace={selectedSpace}>
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  </ProvidersProvider>;
}

