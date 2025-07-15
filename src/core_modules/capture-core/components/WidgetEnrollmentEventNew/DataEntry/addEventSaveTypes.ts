export const addEventSaveTypes = {
    COMPLETE: 'COMPLETE',
    SAVE_WITHOUT_COMPLETING: 'SAVE_WITHOUT_COMPLETING',
} as const;

export type AddEventSaveType = typeof addEventSaveTypes[keyof typeof addEventSaveTypes];
