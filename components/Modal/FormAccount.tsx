import { AccountInterface } from '@/interfaces/Provider.interface';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet } from 'react-native';

interface FormInterface {
  addAccount: (username: string, password: string) => boolean;
  editAccount: (id: string, username: string, password: string) => boolean;
  editingAccount: AccountInterface | null;
  setEditingAccount: (account: AccountInterface | null) => void;
  showPassword: (password: string) => string;
}

export function FormAccount({ addAccount, editAccount, editingAccount, setEditingAccount, showPassword }: FormInterface) {
  const router = useRouter();
  const [username, setUsername] = useState(editingAccount ? editingAccount.username : '');
  const [password, setPassword] = useState(editingAccount ? showPassword(editingAccount.password) : '');
  const [error, setError] = useState('');

  const onChangeUsername = (text: string) => {
    setUsername(text);
  };

  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (username === '') {
      setError('The email is required');
      return false;
    } else if (!regex.test(username)) {
      setError('Invalid email format');
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (password === '' || password === null || password === undefined) {
      setError('The password is required');
      return false;
    }

    return true;
  };

  const handleAddAccount = () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }
    let completed = false;

    if (editingAccount) {
      completed = editAccount(editingAccount.id, username, password);
    } else {
      completed = addAccount(username, password);
    }

    if (!completed) {
      setError(editingAccount ? 'Error updating account' : 'Error adding account');
      return;
    }

    setUsername('');
    setPassword('');
    setEditingAccount(null);

    router.dismiss();
  }

  return (
    <ImageBackground source={require('@/assets/images/dashboardBackground.png')} style={styles.container}>
      <View style={styles.contentHeader}>
        <Text style={styles.textHeader}>{editingAccount ? 'Update' : 'Add'} Account</Text>
      </View>
      <View style={styles.content}>
        <TextInput autoComplete='email' inputMode='email' textContentType='emailAddress' style={styles.textInput} value={username} onChangeText={onChangeUsername} placeholder="Username" />
        <TextInput textContentType='password' style={styles.textInput} value={password} onChangeText={onChangePassword} placeholder="Password" />
        <Text style={styles.textError}>
          {error ? error : ''}
        </Text>
      </View>
      <Text onPress={() => handleAddAccount()} style={styles.textButton} >
        {editingAccount ? 'Update' : 'Add'} account
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    color: 'white',
    justifyContent: 'flex-end',
  },
  content: {
    height: 300,
    maxHeight: '50%',
    alignItems: 'center',
    marginBottom: 100,
  },
  contentHeader: {
    alignItems: 'center',
    marginBottom: 100,
  },
  text: {
    color: 'white',
  },
  textHeader: {
    color: 'white',
    fontFamily: 'TiltNeon',
    fontSize: 40,
    alignSelf: 'center',
  },
  textInput: {
    marginTop: 10,
    width: '90%',
    maxWidth: 700,
    height: 60,
    color: 'black',
    backgroundColor: '#F7AF27',
    padding: 10,
    borderRadius: 5,
  },
  textError: {
    color: 'red',
    fontWeight: 'bold',
  },
  textButton: {
    fontWeight: 'bold',
    backgroundColor: "#F7AF27",
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    borderRadius: 8,
  },
});
