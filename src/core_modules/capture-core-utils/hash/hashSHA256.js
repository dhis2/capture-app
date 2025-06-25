// @flow
export const hashSHA256 = async (input: string) => {
    const inputUint8 = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', inputUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};
