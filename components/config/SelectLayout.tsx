import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SelectLayoutProps {
  layout: string;
  changeLayout: (layout: string) => void;
}

export default function SelectLayout({ layout, changeLayout: setLayout }: SelectLayoutProps) {

  return <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Layout</Text>
    </View>
    <View style={styles.body}>
      <TouchableOpacity style={[styles.button, layout === 'default' && styles.selected]} onPress={() => setLayout('default')}>
        <Text style={styles.buttonText}>Default</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, layout === 'list' && styles.selected]} onPress={() => setLayout('list')}>
        <Text style={styles.buttonText}>List</Text>
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
    height: 180
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
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: 100,
    width: 100,
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
    fontSize: 20,
  },
  selected: {
    backgroundColor: '#F7AF27',
  }
});
