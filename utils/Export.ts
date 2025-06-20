import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import ProviderInterface from '@/interfaces/Provider.interface';
import * as FileSystem from 'expo-file-system';

export async function exportToJson(providers: ProviderInterface[], showPassword: (password: string) => string): Promise<boolean> {
  try {
    // Prepare the data structure for export
    const exportData = {
      meta: {
        exportedAt: new Date().toISOString(),
        version: 1
      },
      providers: providers.map(provider => ({
        name: provider.name,
        accounts: provider.accounts.map(account => ({
          username: account.username,
          password: showPassword(account.password),
          status: account.status
        }))
      }))
    };

    const content = JSON.stringify(exportData, null, 2);

    if (Platform.OS === 'web') {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `password-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        const fileName = `password-export-${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Passwords',
          UTI: 'public.json'
        });
        return true;
      } else {
        console.error('Sharing is not available on this platform');
        return false;
      }
    }
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return false;
  }
} 