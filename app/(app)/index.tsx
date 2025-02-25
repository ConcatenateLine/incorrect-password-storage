import SpaceSelector from '@/components/dashboard/SpaceSelector';
import { useConfig } from '@/hooks/useConfig';
import { useSession } from '@/hooks/useSession';
import { useStorage } from '@/hooks/useStorage';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  const { signOut } = useSession();
  const { spaces, selectedSpace, setSelectedSpace, addSpace } = useStorage();
  const { layout } = useConfig();

  if (selectedSpace) {
    return (
      <Redirect href={`/space`} />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#c2c2c2" }}>
      {
        layout === 'default' ?
          <SpaceSelector spacesList={spaces} setSelectedSpace={setSelectedSpace} />
          : <SpaceSelector spacesList={spaces} setSelectedSpace={setSelectedSpace} />
      }
      <Text
        onPress={() => {
          signOut();
        }} style={{ userSelect: 'none', fontWeight: 'bold', backgroundColor: "#F7AF27", position: 'absolute', bottom: 10, left: 10, padding: 5, borderRadius: 8 }}>
        ⩐ Sign out
      </Text>
      <Text style={{ userSelect: 'none', fontWeight: 'bold', backgroundColor: "#F7AF27", position: 'absolute', bottom: 10, right: 10, padding: 5, borderRadius: 8 }}
        onPress={() => {
          addSpace();
        }}
      >Add Space</Text>
    </View>
  );
}

