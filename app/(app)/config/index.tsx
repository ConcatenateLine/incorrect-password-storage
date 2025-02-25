import SelectLayout from '@/components/config/SelectLayout';
import SelectThreshold from '@/components/config/SelectThreshold';
import { useConfig } from '@/hooks/useConfig';
import { useSession } from '@/hooks/useSession';
import { Redirect, useRouter } from 'expo-router';
import { Text, View, ScrollView, ImageBackground, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { session } = useSession();
  const { pin, setPin, threshold, changeAccess, layout, changeLayout } = useConfig();

  if (!session) {
    return <Redirect href="/sign-in" />
  }

  const handleDimiss = () => {
    router.dismissTo('/');
  };

  return (
    <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: "#c2c2c2" }}>
      <ImageBackground source={require('@/assets/images/dashboardBackground.png')} style={styles.container}>
        <ScrollView style={{ height: '100%' }}>
          <SelectLayout layout={layout} changeLayout={changeLayout} />
          <SelectThreshold pin={pin} setPin={setPin} threshold={threshold} changeAccess={changeAccess} />
        </ScrollView>
        <Text
          onPress={handleDimiss} style={{ fontWeight: 'bold', backgroundColor: "#F7AF27", position: 'absolute', bottom: 10, left: 10, padding: 5, borderRadius: 8 }}>
          ⩐ Back
        </Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    paddingBottom: 40
  },
});
