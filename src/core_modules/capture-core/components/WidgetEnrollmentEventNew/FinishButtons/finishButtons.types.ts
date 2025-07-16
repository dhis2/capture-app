import type { ReactElement } from 'react';
import type { AddEventSaveType } from '../DataEntry/addEventSaveTypes';

export type InputProps = {
    onSave: (saveType: AddEventSaveType) => void;
    onCancel: () => void;
    isLoading?: boolean;
    cancelButtonIsDisabled?: boolean;
    id: string;
};

export type Props = {
    onSave: (saveType: AddEventSaveType) => void;
    cancelButton: ReactElement;
    isLoading?: boolean;
};
