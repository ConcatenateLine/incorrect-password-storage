import { View, StyleSheet } from 'react-native'
import { AccountInterface } from '@/interfaces/Provider.interface';
import Account from './Account';
import { useConfig } from '@/hooks/useConfig';
import AccountList from './AccountList';

interface AccountListProps {
  accountList: AccountInterface[];
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void;
  setEditingAccount: (account: AccountInterface) => void;
}

const AccountsList = ({ accountList, showPassword, deleteAccount, setEditingAccount }: AccountListProps) => {
  const { layout } = useConfig();

  return (
    <View style={styles.container}>
      {accountList?.map((card, index) => (
        layout === 'default' ?
          <Account key={index} account={card} showPassword={showPassword} deleteAccount={deleteAccount} setEditingAccount={setEditingAccount} /> :
          <AccountList key={index} account={card} showPassword={showPassword} deleteAccount={deleteAccount} setEditingAccount={setEditingAccount} />
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

export default AccountsList;
