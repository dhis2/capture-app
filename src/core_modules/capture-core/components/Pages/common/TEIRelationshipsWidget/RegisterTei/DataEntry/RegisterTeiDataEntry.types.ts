export type RegisterTeiDataEntryProps = {
    showDataEntry: boolean;
    programId: string;
    onSaveWithoutEnrollment: () => void;
    onSaveWithEnrollment: () => void;
    error?: string;
};
