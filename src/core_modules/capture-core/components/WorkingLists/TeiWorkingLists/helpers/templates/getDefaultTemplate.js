// @flow

export const getDefaultTemplate = (programId: string) => ({
    id: `${programId}-default`,
    isDefault: true,
    name: 'default',
    access: {
        update: false,
        delete: false,
        write: false,
        manage: false,
    },
    criteria: {
        order: 'createdAt:desc',
    },
});
