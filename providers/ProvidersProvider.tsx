import { useEffect, useState, type PropsWithChildren } from 'react';
import { usePersistentState } from '@/hooks/useStorageState';
import ProvidersContext from '@/contexts/ProvidersContext';
import ProviderInterface, { AccountInterface } from '@/interfaces/Provider.interface';
import { generateRedOrangeHexColor } from '@/utils/GenerateRandomColor';
import { decrypt, encrypt } from '@/utils/Crypto';
import { exportToJson, importFromJson, exportAllWorkspacesToJson, importAllWorkspacesFromJson } from '@/utils/Export';
import Constants from 'expo-constants';

export function ProvidersProvider({ children, selectedSpace }: PropsWithChildren & { selectedSpace: string | null }) {
  const secret = Constants.expoConfig?.extra?.SECRET_KEY || '';
  const [[isLoadingProviders, providers], setProviders] = usePersistentState<ProviderInterface[]>(selectedSpace ? selectedSpace : 'providers');
  const [error, setError] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<AccountInterface | null>(null);

  const addAccount = (username: string, password: string): boolean => {
    const newProvider = username.split('@')[1];
    const encryptedPassword = encrypt(password, secret);

    if (providers) {
      const provider = providers.find((p) => p.name === newProvider);

      if (!provider) {
        setProviders([
          ...providers,
          {
            id: newProvider,
            name: newProvider,
            image: '',
            color: generateRedOrangeHexColor(),
            accounts: [
              {
                status: 'active',
                id: username + '@0',
                username: username,
                password: encryptedPassword,
              }
            ]
          }
        ])
      }

      if (provider) {
        setProviders([
          ...providers.filter((p) => p.name !== newProvider),
          {
            ...provider,
            accounts: [
              ...provider.accounts,
              {
                status: 'active',
                id: username + '@' + provider.accounts.length,
                username: username,
                password: encryptedPassword,
              }
            ]
          }
        ])
      }

      return true;
    } else {
      setProviders([
        {
          id: newProvider,
          name: newProvider,
          image: '',
          color: generateRedOrangeHexColor(),
          accounts: [
            {
              status: 'active',
              id: username + '@0',
              username: username,
              password: encrypt(password, secret),
            }
          ]
        }
      ])
      return true;
    }
  }

  const showPassword = (password: string) => {
    const decryptedPassword = decrypt(password, secret);

    if (!decryptedPassword) {
      return '';
    }

    return decryptedPassword;
  }

  const archiveAccount = (id: string, username: string) => {
    if (isLoadingProviders || !providers) {
      return;
    }

    const provider = username.split('@')[1];
    const findedProvider = providers?.find((p) => p.name === provider);

    if (!findedProvider) {
      return;
    }

    const filteredAccounts = findedProvider.accounts.filter((a) => a.id !== id);

    setProviders(providers.map((p) => p.name === provider ? { ...p, accounts: filteredAccounts } : p));
  }

  const editAccount = (id: string, username: string, password: string): boolean => {
    if (isLoadingProviders || !providers) {
      return false;
    }

    const provider = username.split('@')[1];
    const findedProvider = providers?.find((p) => p.name === provider);

    if (!findedProvider) {
      return false;
    }

    const findedAccount = findedProvider.accounts.find((a) => a.id === id);

    if (!findedAccount) {
      return false;
    }

    const filteredAccounts = findedProvider.accounts.filter((a) => a.id !== id);

    setProviders(providers.map((p) => p.name === provider ? { ...p, accounts: [...filteredAccounts, { ...findedAccount, password: encrypt(password, secret) }] } : p));

    return true;
  }

  const handleExportToJson = async (): Promise<boolean> => {
    if (!providers || providers.length === 0) {
      setError('No data to export');
      return false;
    }
    
    try {
      const success = await exportToJson(providers, showPassword);
      if (success) {
        setError(null);
      } else {
        setError('Export failed');
      }
      return success;
    } catch (error) {
      setError('Export failed');
      return false;
    }
  };

  const handleImportFromJson = async (): Promise<boolean> => {
    try {
      const result = await importFromJson();
      if (!result) {
        setError('Import failed or was cancelled');
        return false;
      }

      const { providers: importedProviders } = result;
      
      if (!importedProviders || importedProviders.length === 0) {
        setError('No valid data found in the imported file');
        return false;
      }

      // Merge imported providers with existing ones
      const existingProviders = providers || [];
      const mergedProviders: ProviderInterface[] = [];

      // Process each imported provider
      importedProviders.forEach(importedProvider => {
        const existingProvider = existingProviders.find(p => p.name === importedProvider.name);
        
        if (existingProvider) {
          // Merge accounts, avoiding duplicates by username
          const existingUsernames = new Set(existingProvider.accounts.map(a => a.username));
          const newAccounts: AccountInterface[] = importedProvider.accounts.filter(account => 
            !existingUsernames.has(account.username)
          ).map((account, index) => ({
            ...account,
            id: account.username + '@' + (existingProvider.accounts.length + index),
            password: encrypt(account.password, secret) // Re-encrypt with current secret
          }));

          mergedProviders.push({
            ...existingProvider,
            accounts: [...existingProvider.accounts, ...newAccounts]
          });
        } else {
          // Add new provider
          mergedProviders.push({
            ...importedProvider,
            id: importedProvider.name,
            image: '',
            color: generateRedOrangeHexColor(),
            accounts: importedProvider.accounts.map((account, index) => ({
              ...account,
              id: account.username + '@' + index,
              password: encrypt(account.password, secret) // Encrypt with current secret
            }))
          });
        }
      });

      // Add existing providers that weren't in the import
      existingProviders.forEach(existingProvider => {
        if (!mergedProviders.find(p => p.name === existingProvider.name)) {
          mergedProviders.push(existingProvider);
        }
      });

      setProviders(mergedProviders);
      setError(null);
      return true;
    } catch (error) {
      setError('Import failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    }
  };

  const handleExportAllWorkspacesToJson = async (): Promise<boolean> => {
    try {
      return await exportAllWorkspacesToJson(showPassword);
    } catch (error) {
      setError('Export all workspaces failed');
      return false;
    }
  };

  const handleImportAllWorkspacesFromJson = async (): Promise<boolean> => {
    try {
      return await importAllWorkspacesFromJson((password: string) => encrypt(password, secret));
    } catch (error) {
      setError('Import all workspaces failed');
      return false;
    }
  };

  useEffect(() => {
    if (!isLoadingProviders && !providers) {
      addAccount(
        'account@example.com',
        'password'
      );
    }
  }, [isLoadingProviders])

  return (
    <ProvidersContext.Provider
      value={{
        addAccount: addAccount,
        archiveAccount: archiveAccount,
        showPassword: showPassword,
        providers: providers ?? [],
        isLoadingProviders,
        error,
        setError,
        editingAccount,
        setEditingAccount,
        editAccount,
        exportToJson: handleExportToJson,
        importFromJson: handleImportFromJson,
        exportAllWorkspacesToJson: handleExportAllWorkspacesToJson,
        importAllWorkspacesFromJson: handleImportAllWorkspacesFromJson
      }}>
      {children}
    </ProvidersContext.Provider>
  );
}
