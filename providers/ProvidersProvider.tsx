import { useEffect, useState, type PropsWithChildren } from 'react';
import { usePersistentState } from '@/hooks/useStorageState';
import ProvidersContext from '@/contexts/ProvidersContext';
import ProviderInterface, { AccountInterface } from '@/interfaces/Provider.interface';
import { generateRedOrangeHexColor } from '@/utils/GenerateRandomColor';
import { decrypt, encrypt } from '@/utils/Crypto';
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

  useEffect(() => {
    if (!isLoadingProviders && !providers) {
      addAccount(
        'gNwNp@example.com',
        'password'
      );
    }
  }, [isLoadingProviders])

  return (
    <ProvidersContext.Provider
      value={{
        addAccount: (username: string, password: string) => {
          return addAccount(username, password);
        },
        archiveAccount: (id: string, username: string) => {
          archiveAccount(id, username);
        },
        showPassword: (password: string) => {
          return showPassword(password);
        },
        providers: providers ?? [],
        isLoadingProviders,
        error,
        setError,
        editingAccount,
        setEditingAccount,
        editAccount
      }}>
      {children}
    </ProvidersContext.Provider>
  );
}
