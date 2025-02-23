import { ComponentProps, useEffect, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

interface NeonTextFlickeringProps {
  text: string,
}

const NeonTextFlickering = (props: NeonTextFlickeringProps & ComponentProps<typeof Text>) => {
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const flicker = () => {
      const createFlickerSequence = (duration: number, toValue: number) => {
        return Animated.timing(opacity, {
          toValue,
          duration,
          useNativeDriver: true,
        });
      };

      Animated.sequence([
        createFlickerSequence(1500, 1),
        createFlickerSequence(1000, 0.8),
        createFlickerSequence(100, 0.2),
        createFlickerSequence(100, 1),
        createFlickerSequence(100, 0.2),
        createFlickerSequence(100, 1),
        createFlickerSequence(500, 0.5),
        createFlickerSequence(1500, 1),
        createFlickerSequence(1000, 0.7),
        createFlickerSequence(2000, 1),
        createFlickerSequence(500, 0.4),
      ]).start(() => flicker());
    };

    flicker();

    return () => {
      opacity.stopAnimation();
    };
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={[styles.neonText,props.style]}>{props.text}</Text>
      <Text style={[styles.neonText2,props.style]}>{props.text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  neonText: {
    width: '100%',
    letterSpacing: 2,
    position: 'absolute',
    fontSize: 42,
    alignSelf: 'center',
    color: '#F7AF27',
    textShadowColor: '#D03A06',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 22,
    shadowOpacity: 0.8,
    fontFamily: 'TiltNeon',
  },
  neonText2: {
    width: '100%',
    letterSpacing: 2,
    position: 'absolute',
    fontSize: 42,
    alignSelf: 'center',
    color: '#F7AF27',
    textShadowColor: '#D03A06',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 22,
    shadowOpacity: 0.8,
    fontFamily: 'TiltNeon',
  }

});

export default NeonTextFlickering;

