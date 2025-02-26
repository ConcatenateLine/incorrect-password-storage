import ProviderList from '@/components/Space/ProviderList';
import ProviderListList from '@/components/Space/ProviderListList';
import { useConfig } from '@/hooks/useConfig';
import { useProviders } from '@/hooks/useProviders';
import { useSession } from '@/hooks/useSession';
import { useStorage } from '@/hooks/useStorage';
import { Link, Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View, ScrollView, ImageBackground, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { session } = useSession();
  const { layout } = useConfig();
  const { setSelectedSpace } = useStorage();
  const { providers, showPassword, archiveAccount, setEditingAccount } = useProviders();

  if (!session) {
    <Redirect href="/sign-in" />
  }

  const handleDimiss = () => {
    router.dismissTo('/');
  };

  useEffect(() => {
    return () => {
      setSelectedSpace(null);
    }
  }, []);

  return (
    <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: "#c2c2c2" }}>
      <ImageBackground source={require('@/assets/images/dashboardBackground.png')} style={styles.container}>
        <ScrollView style={{ height: '100%' }}>
          {layout == 'default' ?
            <ProviderList providerList={providers} showPassword={showPassword} deleteAccount={archiveAccount} setEditingAccount={setEditingAccount} /> :
            <ProviderListList providerList={providers} showPassword={showPassword} deleteAccount={archiveAccount} setEditingAccount={setEditingAccount} />
          }
        </ScrollView>
        <Text
          onPress={handleDimiss} style={{ fontWeight: 'bold', backgroundColor: "#F7AF27", position: 'absolute', bottom: 10, left: 10, padding: 5, borderRadius: 8 }}>
          ⩐ Spaces
        </Text>
        <Link href="/space/modal" style={{ fontWeight: 'bold', backgroundColor: "#F7AF27", position: 'absolute', bottom: 10, right: 10, padding: 5, borderRadius: 8 }} >
          Add account
        </Link>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    paddingBottom: 50
  },
});
