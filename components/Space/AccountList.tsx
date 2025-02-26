import { AccountInterface } from '@/interfaces/Provider.interface';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View, Animated, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface AccountListProps {
  account: AccountInterface;
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void
  setEditingAccount: (account: AccountInterface) => void
}

export default function AccountList({ account, showPassword, deleteAccount, setEditingAccount }: AccountListProps) {
  const router = useRouter();
  const [revelatePassword, setShowPassword] = useState(false);
  const animatedProps = useRef({
    width: new Animated.Value(0),
    height: new Animated.Value(60),
  }).current;

  const handlePress = () => {
    if (revelatePassword) {
      Animated.timing(animatedProps.height, {
        toValue: 60,
        duration: 100,
        useNativeDriver: false
      }).start();

      setShowPassword(false);
      return;
    } else {
      Animated.timing(animatedProps.height, {
        toValue: 120,
        duration: 200,
        useNativeDriver: false
      }).start();

      setShowPassword(true);
    };
  };

  const handleReveal = (password: string) => {
    let passwordRevealed = showPassword(password);

    return passwordRevealed ? passwordRevealed : '**********';
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteAccount(account.id, account.username),
          style: 'destructive',
        },
        {
          text: 'Edit',
          onPress: () => {
            setEditingAccount(account);
            router.push('/space/modal')
          },
          style: 'default',
        }
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={
          [styles.item,
          {
            zIndex: 1,
            height: animatedProps.height,
          }]}
      >
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => handlePress()}
          onLongPress={handleDelete}
        >
          <Text style={styles.itemText}>{account.username}</Text>
          <Text style={styles.itemText}>{revelatePassword ? '-' : '+'}</Text>
        </TouchableOpacity>
        <View style={styles.bodyContent} >
          <Text style={styles.bodyText}>
            {revelatePassword ?
              handleReveal(account.password) :
              '**********'}
          </Text>
        </View>
      </Animated.View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  item: {
    backgroundColor: '#F7AF27',
    paddingTop: 60,
    height: 60,
    shadowColor: '#F7AF27',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 22,
    elevation: 5,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
    borderRadius: 8,
    position: 'absolute',
    padding: 20,
    width: '100%',
  },
  itemText: {
    color: 'black',
    fontFamily: 'TiltNeon',
    fontSize: 18,
  },
  bodyContent: {
    margin: "1%",
    width: '98%',
    backgroundColor: '#570F11',
    padding: 10,
  },
  bodyText: {
    textAlignVertical: 'center',
    textAlign: 'right',
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 18,
    userSelect: 'none',
    width: '100%',
  },
});

