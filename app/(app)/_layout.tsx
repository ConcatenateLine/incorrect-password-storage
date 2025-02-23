import { ImageBackground, Text, StyleSheet } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { StorageProvider } from '@/providers/StorageProvider';
import NeonTextFlickering from '@/components/NeonTextFlickering';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <StorageProvider>
    <Stack screenOptions={{
      header: () => {
        return (
          <ImageBackground source={require('@/assets/images/headerBackground.png')} style={styles.header}>
            <NeonTextFlickering text={ `☸ ${dayName}`} style={styles.headerText} />
          </ImageBackground>
        );
      }
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="space" />
    </Stack>
  </StorageProvider>;
}

const styles = StyleSheet.create({
  header: {
    width: '105%',
    height: 210,
    margin: "-5%"
  },
  headerText: {
    color: '#F7AF27',
    fontSize: 64,
    right: "-8%",
    marginTop: "10%"
  }
});

