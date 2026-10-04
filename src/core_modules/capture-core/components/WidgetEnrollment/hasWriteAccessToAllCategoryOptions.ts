import type { EnrollmentCategoryOptionCombo } from './enrollment.types';

export const hasWriteAccessToAllCategoryOptions = (details?: EnrollmentCategoryOptionCombo) =>
    !details || details.categoryOptions.every(option => option.access?.data?.write);

export const getEnrollmentReadOnly = (
    readOnlyMode: boolean,
    programWriteAccess: boolean,
    attributeOptionComboWriteAccess: boolean,
) => readOnlyMode || !programWriteAccess || !attributeOptionComboWriteAccess;
