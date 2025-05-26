import * as CryptoJS from 'crypto-js';

export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(cipherText),
    process.env.CRYPTO_SECRET || '',
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
