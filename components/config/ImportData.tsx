import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface ImportDataProps {
  importFromJson: () => Promise<boolean>;
  importAllWorkspacesFromJson?: () => Promise<boolean>;
  isLoading?: boolean;
  importAll?: boolean;
}

export default function ImportData({ importFromJson, importAllWorkspacesFromJson, isLoading = false, importAll = false }: ImportDataProps) {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    Alert.alert(
      importAll ? 'Import All Workspaces' : 'Import Data',
      importAll
        ? 'This will import all workspaces and passwords from a JSON file. Existing data will be merged with imported data. Continue?'
        : 'This will import passwords from a JSON file. Existing data will be merged with imported data. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Import',
          style: 'default',
          onPress: async () => {
            setIsImporting(true);
            try {
              const success = importAll
                ? await (importAllWorkspacesFromJson && importAllWorkspacesFromJson())
                : await importFromJson();
              if (success) {
                Alert.alert('Success', 'Data imported successfully!');
              } else {
                Alert.alert('Error', 'Failed to import data. Please check the file format and try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred during import.');
            } finally {
              setIsImporting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{importAll ? 'Import All Workspaces' : 'Import Data'}</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity 
          style={[styles.button, (isImporting || isLoading) && styles.disabled]} 
          onPress={handleImport}
          disabled={isImporting || isLoading}
        >
          <Text style={styles.buttonText}>
            {isImporting
              ? (importAll ? 'Importing All...' : 'Importing...')
              : (importAll ? 'Import All Workspaces from JSON' : 'Import from JSON')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: '#570F11',
    borderColor: '#F7AF27',
    borderWidth: 1,
    borderRadius: 8,
    height: 140
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
    height: 70,
    paddingHorizontal: 40,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    width: '100%',
    borderColor: '#F7AF27',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7AF27',
  },
  buttonText: {
    color: '#570F11',
    userSelect: 'none',
    fontFamily: 'TiltNeon',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  }
}); 