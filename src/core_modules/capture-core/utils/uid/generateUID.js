// @flow

export const generateUID = (): string => {
    const letters = 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const allowedChars = `0123456789${letters}`;
    const NUMBER_OF_CODEPOINTS = allowedChars.length;
    const CODESIZE = 11;
    let uid;

    // the uid should start with a char
    uid = letters.charAt(Math.random() * (letters.length));

    for (let i = 1; i < CODESIZE; ++i) {
        uid += allowedChars.charAt(Math.random() * (NUMBER_OF_CODEPOINTS));
    }

    return uid;
};
