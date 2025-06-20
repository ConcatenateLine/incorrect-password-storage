import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import ProviderInterface from "@/interfaces/Provider.interface";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { replaceNonAlphanumeric } from "@/utils/Crypto";
import * as SecureStore from "expo-secure-store";

export async function exportToJson(
  providers: ProviderInterface[],
  showPassword: (password: string) => string
): Promise<boolean> {
  try {
    // Prepare the data structure for export
    const exportData = {
      meta: {
        exportedAt: new Date().toISOString(),
        version: 1,
      },
      providers: providers.map((provider) => ({
        name: provider.name,
        accounts: provider.accounts.map((account) => ({
          username: account.username,
          password: showPassword(account.password),
          status: account.status,
        })),
      })),
    };

    const content = JSON.stringify(exportData, null, 2);

    if (Platform.OS === "web") {
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `password-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        const fileName = `password-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Passwords",
          UTI: "public.json",
        });
        return true;
      } else {
        console.error("Sharing is not available on this platform");
        return false;
      }
    }
  } catch (error) {
    console.error("Error exporting to JSON:", error);
    return false;
  }
}

export async function importFromJson(): Promise<{
  providers: ProviderInterface[];
  meta: any;
} | null> {
  try {
    let fileContent: string;

    if (Platform.OS === "web") {
      // Web: Create a file input and read the file
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      const file = await new Promise<File>((resolve, reject) => {
        input.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files[0]) {
            resolve(target.files[0]);
          } else {
            reject(new Error("No file selected"));
          }
        };
        input.click();
      });

      fileContent = await file.text();
    } else {
      // Mobile: Use expo-document-picker
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const fileUri = result.assets[0].uri;
      fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    // Parse and validate JSON
    const parsedData = JSON.parse(fileContent);

    // Validate structure
    if (
      !parsedData.meta ||
      !parsedData.providers ||
      !Array.isArray(parsedData.providers)
    ) {
      throw new Error("Invalid file format: missing meta or providers array");
    }

    // Validate each provider
    const validatedProviders: ProviderInterface[] = parsedData.providers.map(
      (provider: any, index: number) => {
        if (!provider.name || !Array.isArray(provider.accounts)) {
          throw new Error(
            `Invalid provider at index ${index}: missing name or accounts array`
          );
        }

        return {
          name: provider.name,
          accounts: provider.accounts.map(
            (account: any, accountIndex: number) => {
              if (!account.username || !account.password || !account.status) {
                throw new Error(
                  `Invalid account at provider ${index}, account ${accountIndex}: missing required fields`
                );
              }

              return {
                username: account.username,
                password: account.password,
                status: account.status,
              };
            }
          ),
        };
      }
    );

    return {
      providers: validatedProviders,
      meta: parsedData.meta,
    };
  } catch (error) {
    console.error("Error importing from JSON:", error);
    return null;
  }
}

// --- Storage helpers ---
async function readJsonFromStorage(key: string): Promise<any | null> {
  if (Platform.OS === "web") {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } else {
    const raw = await SecureStore.getItemAsync(key);
    return raw ? JSON.parse(raw) : null;
  }
}

async function writeJsonToStorage(key: string, value: any): Promise<void> {
  const json = JSON.stringify(value);
  if (Platform.OS === "web") {
    localStorage.setItem(key, json);
  } else {
    await SecureStore.setItemAsync(key, json);
  }
}

// --- Workspace/provider helpers ---
async function getAllWorkspaceNames(): Promise<string[]> {
  const spacesObj = await readJsonFromStorage("spaces");
  return Array.isArray(spacesObj?.value) ? spacesObj.value.map((s: any) => s.name) : [];
}

async function getProvidersForWorkspace(workspace: string): Promise<ProviderInterface[]> {
  const key = replaceNonAlphanumeric(workspace);
  const obj = await readJsonFromStorage(key);
  return obj?.value || [];
}

async function setProvidersForWorkspace(workspace: string, providers: ProviderInterface[]) {
  const key = replaceNonAlphanumeric(workspace);
  await writeJsonToStorage(key, { value: providers });
}

// --- Merging helpers ---
function mergeAccounts(
  existingAccounts: { id: string; username: string; password: string; status: string }[],
  importedAccounts: { id?: string; username: string; password: string; status: string }[],
  encryptPassword: (password: string) => string
): { id: string; username: string; password: string; status: string }[] {
  const existingUsernames = new Set(existingAccounts.map(a => a.username));
  const mergedAccounts = [...existingAccounts];
  importedAccounts.forEach(importedAccount => {
    let newUsername = importedAccount.username;
    let suffix = 1;
    while (existingUsernames.has(newUsername) || mergedAccounts.some(a => a.username === newUsername)) {
      suffix++;
      newUsername = `${importedAccount.username} (imported${suffix > 2 ? ' ' + suffix : ''})`;
    }
    existingUsernames.add(newUsername);
    mergedAccounts.push({
      id: importedAccount.id || `${newUsername}@${mergedAccounts.length}`,
      ...importedAccount,
      username: newUsername,
      password: encryptPassword(importedAccount.password)
    });
  });
  return mergedAccounts;
}

function mergeProviders(
  existingProviders: ProviderInterface[],
  importedProviders: ProviderInterface[],
  encryptPassword: (password: string) => string
): ProviderInterface[] {
  const mergedProviders = [...existingProviders];
  importedProviders.forEach(importedProvider => {
    const existingProvider = mergedProviders.find(p => p.name === importedProvider.name);
    if (existingProvider) {
      existingProvider.accounts = mergeAccounts(existingProvider.accounts, importedProvider.accounts, encryptPassword);
    } else {
      mergedProviders.push({
        ...importedProvider,
        accounts: importedProvider.accounts.map(account => ({
          ...account,
          password: encryptPassword(account.password)
        }))
      });
    }
  });
  return mergedProviders;
}

export async function exportAllWorkspacesToJson(
  showPassword: (password: string) => string
): Promise<boolean> {
  try {
    const workspaceNames = await getAllWorkspaceNames();
    const workspaces: Record<string, { providers: ProviderInterface[] }> = {};

    for (const name of workspaceNames) {
      const providers = await getProvidersForWorkspace(name);
      // Decrypt passwords for export
      workspaces[name] = {
        providers: providers.map((provider) => ({
          ...provider,
          accounts: provider.accounts.map((account) => ({
            ...account,
            password: showPassword(account.password),
          })),
        })),
      };
    }
    const exportData = {
      meta: {
        exportedAt: new Date().toISOString(),
        version: 1,
      },
      workspaces,
    };
    const content = JSON.stringify(exportData, null, 2);
    const fileName = `all-workspaces-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    if (Platform.OS === "web") {
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, content, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export All Workspaces",
          UTI: "public.json",
        });
        return true;
      } else {
        console.error("Sharing is not available on this platform");
        return false;
      }
    }
  } catch (error) {
    console.error("Error exporting all workspaces:", error);
    return false;
  }
}

export async function importAllWorkspacesFromJson(
  encryptPassword: (password: string) => string
): Promise<boolean> {
  try {
    let fileContent: string;
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      const file = await new Promise<File>((resolve, reject) => {
        input.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files[0]) {
            resolve(target.files[0]);
          } else {
            reject(new Error("No file selected"));
          }
        };
        input.click();
      });
      fileContent = await file.text();
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false;
      }
      const fileUri = result.assets[0].uri;
      fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }
    const parsedData = JSON.parse(fileContent);
    if (
      !parsedData.meta ||
      !parsedData.workspaces ||
      typeof parsedData.workspaces !== "object"
    ) {
      throw new Error("Invalid file format: missing meta or workspaces");
    }
    for (const [workspace, data] of Object.entries(parsedData.workspaces) as [string, { providers: ProviderInterface[] }][]) {
      if (!data.providers || !Array.isArray(data.providers)) continue;
      const existingProviders = await getProvidersForWorkspace(workspace);
      const mergedProviders = mergeProviders(existingProviders, data.providers, encryptPassword);
      await setProvidersForWorkspace(workspace, mergedProviders);
    }
    // Update the 'spaces' key to include all imported workspaces
    const importedWorkspaceNames = Object.keys(parsedData.workspaces);
    const importedSpaces = importedWorkspaceNames.map((name) => {
      return {
        name,
        color: name === "Default" ? "#570F11" : `${name.toString()}`,
        state: "active",
      };
    });
    let currentSpaces: { name: string; color: string; state: string }[] = [];
    const spacesObj = await readJsonFromStorage("spaces");
    if (Array.isArray(spacesObj?.value)) currentSpaces = spacesObj.value;
    const mergedSpaces = [
      ...currentSpaces.filter((s) => !importedWorkspaceNames.includes(s.name)),
      ...importedSpaces,
    ];
    await writeJsonToStorage("spaces", { value: mergedSpaces });
    return true;
  } catch (error) {
    console.error("Error importing all workspaces:", error);
    return false;
  }
}
