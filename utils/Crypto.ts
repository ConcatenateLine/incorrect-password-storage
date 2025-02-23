// import * as Crypto from 'expo-crypto';

// const iv = '1234567890123456'; 

// export async function encrypt(text: string, key: string){
//   const cipher = await Crypto.digestStringAsync(
//     Crypto.CryptoDigestAlgorithm.SHA256,
//     key + iv + text
//   );
//   return cipher;
// };

// export async function decrypt(cipher: string, key: string){
//   const originalText = cipher.replace(Crypto.CryptoDigestAlgorithm.SHA256, key + iv);
//   return originalText;
// };
//
// Todo: Encryption and Decryption with AES

export function encrypt(text: string, key: string) {
  const keyLength = key.length;
  let encryptedText = '';

  for (let i = 0; i < text.length; i++) {
    // XOR entre el carácter del texto y el carácter de la clave
    const xorChar = text.charCodeAt(i) ^ key.charCodeAt(i % keyLength);

    // Desplazamiento (shift) del carácter XOR
    const shiftedChar = (xorChar + keyLength) % 256;

    // Permutación simple
    encryptedText += String.fromCharCode(shiftedChar);
  }

  return encryptedText;
};

export function decrypt(encryptedText: string, key: string) {
  const keyLength = key.length;
  let decryptedText = '';

  for (let i = 0; i < encryptedText.length; i++) {
    // Revertir la permutación simple
    const permutedChar = (encryptedText.charCodeAt(i) - keyLength + 256) % 256;

    // Revertir el desplazamiento (shift)
    const xorChar = permutedChar ^ key.charCodeAt(i % keyLength);

    decryptedText += String.fromCharCode(xorChar);
  }

  return decryptedText;
};


export function replaceNonAlphanumeric(text: string) {
  return text.replace(/[^a-zA-Z0-9]/g, '_');
};
