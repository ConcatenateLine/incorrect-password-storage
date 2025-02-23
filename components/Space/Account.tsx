import { AccountInterface } from '@/interfaces/Provider.interface';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View, Animated, Text, StyleSheet, TouchableOpacity, PanResponder, Alert } from 'react-native';

interface AccountProps {
  account: AccountInterface;
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void
  setEditingAccount: (account: AccountInterface) => void
}

export default function Account({ account, showPassword, deleteAccount, setEditingAccount }: AccountProps) {
  const router = useRouter();
  const [revelatePassword, setShowPassword] = useState(false);
  const animatedProps = useRef({
    width: new Animated.Value(0),
    height: new Animated.Value(100),
  }).current;

  const interpolateWidth = animatedProps.width.interpolate({
    inputRange: [-60, 0],
    outputRange: ['55%', '96%'],
  });

  const intepolateFontSize = animatedProps.width.interpolate({
    inputRange: [-60, 0],
    outputRange: [14, 18],
  });

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
    },
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx > -60 && gesture.dx < 0) {
        animatedProps.width.setValue(gesture.dx);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -27) {
        Animated.spring(animatedProps.width, {
          toValue: -60,
          useNativeDriver: false,
        }).start(() => {
          setShowPassword(true);
        });
      } else {
        animatedProps.width.setValue(0);
        setShowPassword(false);
      }
    },
  })).current;

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
        key={account.id + "key"}
        style={
          [styles.header,
          {
            width: interpolateWidth,
          }, revelatePassword ? {
            position: 'absolute',
            top: 0,
            padding: 0,
            height: 30
          } : {}]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[
            styles.headerContent,
          ]}
          onLongPress={handleDelete}
        >
          <Animated.Text style={[styles.headerText, {
            fontSize: intepolateFontSize,
          }]}>{account.username}</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.bodyContent} >
        <Text style={styles.bodyText}>
          {revelatePassword ?
            handleReveal(account.password) :
            '**********'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: 60,
  },
  header: {
    zIndex: 1,
    position: 'absolute',
    margin: "2%",
    width: '96%',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#F7AF27',
    shadowColor: '#F7AF27',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 22,
    elevation: 5,
  },
  bodyContent: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  bodyText: {
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 18,
    userSelect: 'none',
  },
  headerContent: {
    padding: 5,
  },
  headerText: {
    color: 'black',
    fontFamily: 'TiltNeon',
    fontSize: 18,
    userSelect: 'none',
  },
});


