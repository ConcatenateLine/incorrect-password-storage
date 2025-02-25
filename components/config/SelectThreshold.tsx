import { useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SelectThresholdProps {
  threshold: number;
  changeAccess: (newPin: string[]) => boolean;
  pin: string[];
  setPin: (pin: string[]) => void;
}

export default function SelectThreshold({ pin, setPin, threshold, changeAccess }: SelectThresholdProps) {
  const animatedValue = useRef(new Animated.Value(30)).current;

  const addKey = (binaryValue: string) => {
    const newPin = [...pin, binaryValue];

    if (newPin.length >= 4) {
      const accessSaved = changeAccess(newPin);

      if (accessSaved) {
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 35,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 30,
            duration: 100,
            useNativeDriver: false,
          })
        ]).start();
      }

      setPin([]);
    } else {
      setPin(newPin);
    }
  };

  return <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Select Threshold</Text>
    </View>
    <View style={styles.textBody}>
      <Animated.Text style={[styles.textNumber, { fontSize: animatedValue }]}>{threshold}</Animated.Text>
      <Text style={styles.headerText}>{pin.join('-')}</Text>
    </View>
    <View style={styles.body}>
      <TouchableOpacity style={[styles.button, styles.selected]} onPress={() => addKey('0001')}>
        <Text style={styles.buttonText}>1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.selected]} onPress={() => addKey('0010')}>
        <Text style={styles.buttonText}>2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.selected]} onPress={() => addKey('0011')}>
        <Text style={styles.buttonText}>3</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.selected]} onPress={() => addKey('0100')}>
        <Text style={styles.buttonText}>4</Text>
      </TouchableOpacity>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: '#570F11',
    borderColor: '#F7AF27',
    borderWidth: 1,
    borderRadius: 8,
    height: 240
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    userSelect: 'none',
    fontFamily: 'TiltNeon',
    fontSize: 20,
    color: '#F7AF27',
  },
  body: {
    height: 110,
    paddingHorizontal: 40,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: 60,
    width: 60,
    borderColor: '#F7AF27',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    userSelect: 'none',
    fontFamily: 'TiltNeon',
    fontSize: 25,
  },
  selected: {
    backgroundColor: '#F7AF27',
  },
  textBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNumber: {
    userSelect: 'none',
    color: '#F7AF27',
    fontSize: 30,
  },
});
