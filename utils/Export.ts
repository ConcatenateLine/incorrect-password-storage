import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import ProviderInterface from '@/interfaces/Provider.interface';
import * as FileSystem from 'expo-file-system';

function toBase64(str: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    // Browser: encode as UTF-8, then to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  } else {
    // Node.js or React Native: use Buffer
    return Buffer.from(str, 'utf-8').toString('base64');
  }
}

export async function exportToTxt(providers: ProviderInterface[], showPassword: (password: string) => string): Promise<boolean> {
  try {
    // Create the content for the TXT file
    let content = '=== Password Storage Export ===\n';
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += '================================\n\n';

    // Add each provider and its accounts
    providers.forEach((provider, providerIndex) => {
      content += `Provider ${providerIndex + 1}: ${provider.name}\n`;
      content += '─'.repeat(30) + '\n';
      
      if (provider.accounts.length === 0) {
        content += 'No accounts found\n';
      } else {
        provider.accounts.forEach((account, accountIndex) => {
          content += `${accountIndex + 1}. Username: ${account.username}\n`;
          content += `   Password: ${showPassword(account.password)}\n`;
          content += `   Status: ${account.status}\n`;
          content += '\n';
        });
      }
      content += '\n';
    });

    // Add footer
    content += '================================\n';
    content += 'End of export\n';
    content += 'Keep this file secure!\n';

    // For web platform, create a downloadable file
    if (Platform.OS === 'web') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `password-export-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      // For mobile platforms, use expo-sharing
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Create a temporary file path (this is a simplified approach)
        // In a real implementation, you'd use expo-file-system to write the file
        const fileName = `password-export-${new Date().toISOString().split('T')[0]}.txt`;
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Passwords',
          UTI: 'public.plain-text'
        });
        return true;
      } else {
        console.error('Sharing is not available on this platform');
        return false;
      }
    }
  } catch (error) {
    console.error('Error exporting to TXT:', error);
    return false;
  }
} 