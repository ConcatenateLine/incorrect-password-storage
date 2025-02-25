import SpaceInterface from '@/interfaces/Space.interface';
import { useMemo } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, ImageBackground } from 'react-native'

interface SpaceSelectorProps {
  spacesList: SpaceInterface[]
  setSelectedSpace: (spaceName: string | null) => void
}

const SpaceSelector = ({ spacesList, setSelectedSpace }: SpaceSelectorProps) => {
  const cardStack = useMemo(() => {
    if (!spacesList) return [];

    return spacesList.map(() => new Animated.ValueXY())
  }, [spacesList]);

  const createPanResponder = (index: number) => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dx < 0) {
        cardStack[index].setValue({ x: gesture.dx, y: 0 });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -100) {
        Animated.timing(cardStack[index], {
          toValue: { x: -700, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          if (spacesList && spacesList[index]) {
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
            <View style={styles.cardContent} >
              <Text style={styles.cardText}>{card.name}</Text>
            </View>
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
  cardText: {
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 28,
    transform: [{ rotate: '90deg' }],
    userSelect: 'none',
  },
});

export default SpaceSelector
