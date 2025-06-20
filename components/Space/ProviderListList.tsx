import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import ProviderInterface from '@/interfaces/Provider.interface';
import AccountsList from './AccountsList';

interface ProviderListListProps {
  providerList: ProviderInterface[];
  showPassword: (password: string) => string;
  deleteAccount: (id: string, username: string) => void
  setEditingAccount: (account: any) => void
}

const ProviderListList = ({ providerList, showPassword, deleteAccount, setEditingAccount }: ProviderListListProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cardStack = useMemo(() => {
    if (!providerList) return [];
    return providerList.map((provider) => {
      return {
        y: new Animated.Value(60),
        height: 60 + (130 * provider.accounts.length),
      }
    });
  }, [providerList]);

  const handleCardPress = (index: number) => {
    if (!cardStack[index]){
      setSelectedCard(null);
      return;
    }

    if (selectedCard === index) {
      Animated.timing(cardStack[index].y, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false
      }).start();

      setSelectedCard(null);
      return;
    }

    if (selectedCard !== null && cardStack[selectedCard]) {
      Animated.timing(cardStack[selectedCard].y, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false
      }).start();
    }

    Animated.timing(cardStack[index].y, {
      toValue: cardStack[index].height,
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
            <Text style={styles.itemText}>{selectedCard === index ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          <AccountsList accountList={item.accounts} showPassword={showPassword} deleteAccount={deleteAccount} setEditingAccount={setEditingAccount} />
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
    paddingTop: 20,
  },
  item: {
    height: "auto",
    marginHorizontal: 5,
    paddingTop: 60,
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
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 18,
  },
});

export default ProviderListList
