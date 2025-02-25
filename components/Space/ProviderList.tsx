import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import ProviderInterface from '@/interfaces/Provider.interface';
import AccountList from './AccountsList';

interface ProviderListProps {
  providerList: ProviderInterface[];
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void
  setEditingAccount: (account: any) => void
}

const ProviderList = ({ providerList, showPassword, deleteAccount, setEditingAccount }: ProviderListProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cardStack = useMemo(() => {
    if (!providerList) return [];

    return providerList.map(() => {
      return {
        y: new Animated.Value(60),
      }
    });
  }, [providerList]);


  const handleCardPress = (index: number) => {
    if (selectedCard === index) {
      Animated.timing(cardStack[index].y, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false
      }).start();

      setSelectedCard(null);
      return;
    }

    if (selectedCard !== null) {
      Animated.timing(cardStack[selectedCard].y, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false
      }).start();
    }

    Animated.timing(cardStack[index].y, {
      toValue: 60 + (100 * (providerList[index].accounts.length)),
      duration: 200,
      useNativeDriver: false
    }).start();

    setSelectedCard(index);
  };

  return (
    <View style={styles.container}>
      {providerList?.map((item, index) => (
        <Animated.View
          key={index}
          style={
            [styles.item,
            {
              overflow: 'hidden',
              borderStartEndRadius: 0,
              borderEndEndRadius: 0,
              backgroundColor: item.color,
              zIndex: 1,
              height: cardStack[index].y
            }]}
        >
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() => handleCardPress(index)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
          <AccountList accountList={item.accounts} showPassword={showPassword} deleteAccount={deleteAccount} setEditingAccount={setEditingAccount} />
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    paddingBottom: 40,
  },
  item: {
    margin: 20,
    paddingTop: 60,
    borderRadius: 8,
    height: 100,
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
    borderRadius: 8,
    position: 'absolute',
    padding: 20,
    width: '100%',
  },
  itemText: {
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 18,
  },
});

export default ProviderList
