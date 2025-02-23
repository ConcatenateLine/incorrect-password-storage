import SpaceInterface from '@/interfaces/Space.interface';
import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder, ImageBackground } from 'react-native'
import NeonTextFlickering from '../NeonTextFlickering';

interface SpaceSelectorProps {
  spacesList: SpaceInterface[]
  setSelectedSpace: (spaceName: string | null) => void
}

const SpaceSelector = ({ spacesList, setSelectedSpace }: SpaceSelectorProps) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const cardStack = useMemo(() => { 
    if (!spacesList) return [];

    return spacesList.map(() => new Animated.ValueXY())
  }, [spacesList]);

  const handleCardPress = (card: string) => {
    if (selectedCard === card) {
      setSelectedCard(null);
    }

    setSelectedCard(card);
  };

  const createPanResponder = (index: number) => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) {
        cardStack[index].setValue({ x: gesture.dx, y: 0 });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -100) {
        // Animar la tarjeta fuera de la pantalla hacia la izquierda
        Animated.timing(cardStack[index], {
          toValue: { x: -700, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          if (spacesList && spacesList[index]) {
            setSelectedCard(spacesList[index].name);
            setSelectedSpace(spacesList[index].name);
          }
        });
      } else {
        Animated.spring(cardStack[index], {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

      }
    },
  });

  return (
    <ImageBackground source={require('@/assets/images/dashboardBackground.png')} style={styles.container}>
      <View style={styles.container}>
        {spacesList?.map((card, index) => (
          <Animated.View
            key={index}
            style={
              [styles.card,
              {
                zIndex: spacesList.length - index,
                transform: cardStack[index].getTranslateTransform(),
                backgroundColor: card.color,
                right: index * 40
              }]}
            {...createPanResponder(index).panHandlers}
          >
            <TouchableOpacity
              style={[
                styles.cardContent,
                selectedCard === card.name && styles.selectedCard,
              ]}
              onPress={() => handleCardPress(card.name)}
            >
              <Text style={styles.cardText}>{card.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: 'charcoal',
  },
  card: {
    position: 'absolute',
    justifyContent: 'center',
    padding: 20,
    top: "15%",
    right: 0,
    width: '55%',
    borderRadius: 8,
    height: "65%",
    shadowColor: '#F7AF27',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 22,
    elevation: 5,
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  selectedCard: {
  },
  cardText: {
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 28,
    transform: [{ rotate: '90deg' }],
  },
  selectedCardText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SpaceSelector
