import SpaceInterface from '@/interfaces/Space.interface';
import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, PanResponder, ImageBackground } from 'react-native'

interface SpaceSelectorListProps {
  spacesList: SpaceInterface[]
  setSelectedSpace: (spaceName: string | null) => void
}

const SpaceSelectorList = ({ spacesList, setSelectedSpace }: SpaceSelectorListProps) => {
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
        if (spacesList && spacesList[index]) {
          setSelectedSpace(spacesList[index].name);
        }
      }

      Animated.spring(cardStack[index], {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <ImageBackground source={require('@/assets/images/dashboardBackground.png')} style={styles.container}>
      <ScrollView style={{ height: "100%" }}>
        <View style={styles.container}>
          {spacesList?.map((card, index) => (
            <Animated.View
              key={index}
              style={
                [styles.card,
                {
                  transform: cardStack[index].getTranslateTransform(),
                  backgroundColor: card.color,
                }]}
              {...createPanResponder(index).panHandlers}
            >
              <View style={styles.cardContent} >
                <Text style={styles.cardText}>{card.name}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    paddingBottom: 50,
    paddingTop: 10
  },
  card: {
    width: '94%',
    height: 60,
    marginHorizontal: 20,
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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20
  },
  cardText: {
    color: '#F7AF27',
    fontFamily: 'TiltNeon',
    fontSize: 28,
    userSelect: 'none',
  },
});

export default SpaceSelectorList
