import { View, StyleSheet } from 'react-native'
import { AccountInterface } from '@/interfaces/Provider.interface';
import Account from './Account';

interface AccountListProps {
  accountList: AccountInterface[];
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void;
  setEditingAccount: (account: AccountInterface) => void;
}

const AccountList = ({ accountList, showPassword, deleteAccount, setEditingAccount }: AccountListProps) => {
  return (
    <View style={styles.container}>
      {accountList?.map((card, index) => (
        <Account key={index} account={card} showPassword={showPassword} deleteAccount={deleteAccount} setEditingAccount={setEditingAccount} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '98%',
    backgroundColor: '#570F11',
    margin: '1%'
  },
});

export default AccountList
