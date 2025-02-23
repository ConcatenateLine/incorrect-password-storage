import { FormAccount } from '@/components/Modal/FormAccount';
import { useProviders } from '@/hooks/useProviders';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Modal() {
  const router = useRouter();
  const { addAccount, editAccount, editingAccount, setEditingAccount,showPassword } = useProviders();

  const handleDimiss = () => {
    setEditingAccount(null);
    router.dismiss();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#c2c2c2" }}>
      <FormAccount addAccount={addAccount} editAccount={editAccount} editingAccount={editingAccount} setEditingAccount={setEditingAccount} showPassword={showPassword} />
      <Text
        onPress={handleDimiss} style={{ fontWeight: 'bold', backgroundColor: "#F7AF27", position: 'absolute', bottom: 10, left: 10, padding: 5, borderRadius: 8 }}>
        ⩐ Accounts
      </Text>
    </View>
  );
}
