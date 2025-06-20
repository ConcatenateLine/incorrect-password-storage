import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface ExportDataProps {
  exportToJson: () => Promise<boolean>;
  exportAllWorkspacesToJson?: () => Promise<boolean>;
  isLoading?: boolean;
  exportAll?: boolean;
}

export default function ExportData({ exportToJson, exportAllWorkspacesToJson, isLoading = false, exportAll = false }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    Alert.alert(
      exportAll ? 'Export All Workspaces' : 'Export Data',
      exportAll
        ? 'This will export all your workspaces and passwords to a JSON file. Make sure to keep this file secure!'
        : 'This will export all your passwords to a JSON file. Make sure to keep this file secure!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          style: 'destructive',
          onPress: async () => {
            setIsExporting(true);
            try {
              const success = exportAll
                ? await (exportAllWorkspacesToJson && exportAllWorkspacesToJson())
                : await exportToJson();
              if (success) {
                Alert.alert('Success', 'Data exported successfully!');
              } else {
                Alert.alert('Error', 'Failed to export data. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred during export.');
            } finally {
              setIsExporting(false);
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
        <Text style={styles.headerText}>{exportAll ? 'Export All Workspaces' : 'Export Data'}</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity 
          style={[styles.button, (isExporting || isLoading) && styles.disabled]} 
          onPress={handleExport}
          disabled={isExporting || isLoading}
        >
          <Text style={styles.buttonText}>
            {isExporting
              ? (exportAll ? 'Exporting All...' : 'Exporting...')
              : (exportAll ? 'Export All Workspaces to JSON' : 'Export to JSON')}
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