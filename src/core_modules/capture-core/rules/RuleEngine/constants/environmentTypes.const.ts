// @flow
export const environmentTypes = Object.freeze({
    WebClient: 'WebClient',
    AndroidClient: 'AndroidClient',
    Server: 'Server',
} as const);

export type EnvironmentType = typeof environmentTypes[keyof typeof environmentTypes];
