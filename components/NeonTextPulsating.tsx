import { useEffect, useRef, ComponentProps } from 'react';
import { View, Animated, Text as NativeText, StyleSheet } from 'react-native';
import Svg, { Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, LinearGradient, Stop } from 'react-native-svg';

interface NeonTextPulsatingProps {
  text: string;
}

const NeonTextPulsating = (props: NeonTextPulsatingProps & ComponentProps<typeof NativeText>) => {
  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      glowAnim.stopAnimation();
    };
  }, [glowAnim]);

  return (
    <View style={styles.neonTextContainer}>
      <Svg height="100" width="100%">
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#fff" />
            <Stop offset="1" stopColor="#0fa" />
          </LinearGradient>
          <Filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>
        <Animated.Text
          style={[
            styles.neonText,
            { filter: 'url(#glow)', opacity: glowAnim, color: "url(#gradient)" },
            props.style,
          ]}
        >
          {props.text}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.neonText,
            { filter: 'url(#glow)', opacity: glowAnim, color: "url(#gradient)" },
            props.style,
          ]}
        >
          {props.text}
        </Animated.Text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  neonTextContainer: {
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
    textShadowOffset: { width: 0, height: 0 },
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
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 22,
    shadowOpacity: 0.8,
    fontFamily: 'TiltNeon',
  }
});

export default NeonTextPulsating;
