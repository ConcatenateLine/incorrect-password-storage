import { useEffect, useState, ComponentProps } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface NeonErrorCircleProps {
  error: string | null;
}

const NeonErrorCircle = ({ error, ...props }: NeonErrorCircleProps & ComponentProps<typeof View>) => {
  const [opacity] = useState(new Animated.Value(0.2));

  useEffect(() => {

    if (error) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }

  }, [error]);

  return (
    <Animated.View style={[styles.circle, props.style, { opacity: opacity }]}>
      <View style={styles.circle} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  circle: {
    width: 25,
    height: 36,
    borderRadius: 20,
    position: 'absolute',
    right: "13.2%",
    top: "3.2%",
    opacity: 0.3,
    backgroundColor: '#FF0000',
    shadowColor: '#FF0000',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
  },
});

export default NeonErrorCircle;

