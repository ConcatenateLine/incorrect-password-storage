import { useSession } from '@/hooks/useSession';
import { Link } from 'expo-router';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import NeonTextFlickering from '@/components/NeonTextFlickering';
import NeonErrorCircle from '@/components/NeonErrorCircle';

export default function SignIn() {
  const { signIn, pin, setPin, error, setError, validateAccess } = useSession();

  const addKEy = (binaryValue: string) => {
    const newPin = [...pin, binaryValue];

    if (newPin.length >= 4) {
      const accessGranted = validateAccess();
      if (accessGranted) {
        signIn();
      } else {
        setError("Access denied!");
        setTimeout(() => setError(null), 300);
      }

      setPin([]);
    } else {
      setPin(newPin);
    }
  };

  return (
    <View style={styles.container} >
      <ImageBackground source={require("@/assets/images/headerBackground.png")} style={styles.imageBackground}>
        <NeonTextFlickering text="Incorrect Password Storage" style={styles.headerText} />
      </ImageBackground>
      <View style={styles.body}>
        <ImageBackground source={require("@/assets/images/bodyBackground.png")} style={styles.bodyBackground} resizeMode='stretch'>
          <Link href="/(app)" asChild style={styles.link}>
            <TouchableOpacity activeOpacity={0} onPress={() => addKEy('001')} style={styles.pressableLight}>
            </TouchableOpacity>
          </Link>
          <NeonErrorCircle error={error} style={styles.neonErrorCircle} />
          <Link href="/(app)" asChild style={[styles.link, styles.linkSecond]}>
            <TouchableOpacity activeOpacity={0} onPress={() => addKEy('010')} style={styles.pressableLight}>
            </TouchableOpacity>
          </Link>
          <NeonErrorCircle error={error} style={styles.errorSecond} />
          <Link href="/(app)" asChild style={[styles.link, styles.linkThird]}>
            <TouchableOpacity activeOpacity={0} onPress={() => addKEy('011')} style={styles.pressableLight}>
            </TouchableOpacity>
          </Link>
          <NeonErrorCircle error={error} style={styles.errorThird} />
          <Link href="/(app)" asChild style={[styles.link, styles.linkFourth]}>
            <TouchableOpacity activeOpacity={0} onPress={() => addKEy('100')} style={styles.pressableLight}>
            </TouchableOpacity>
          </Link>
          <NeonErrorCircle error={error} style={styles.errorFourth} />
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    maxHeight: 210,
    justifyContent: "center",
    margin: "-5%",
    zIndex: 1
  },
  headerText: {
    color: '#F7AF27',
    textAlign: 'center',
    marginTop: "-3%",
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    position: "relative"
  },
  bodyBackground: {
    flex: 1,
    margin: "-5%",
    marginTop: "-3%",
  },
  link: {
    flex: 1,
    fontSize: 100,
    right: "8.5%",
    top: "11.5%",
    position: "absolute",
    backgroundColor: "#c2c2c2",
    borderRadius: 78
  },
  pressableLight: {
    width: "14%",
    height: "12%",
    backgroundColor: "black",
    opacity: 0.5
  },
  linkSecond: {
    top: "35%",
    backgroundColor: "#c2c2c2"
  },
  linkThird: {
    top: "59%",
  },
  linkFourth: {
    top: "82%",
  },
  neonErrorCircle: {
    top: "3.2%",
  },
  errorSecond: {
    top: "27%",
  },
  errorThird: {
    top: "50.4%",
  },
  errorFourth: {
    top: "73.5%",
  },
});
