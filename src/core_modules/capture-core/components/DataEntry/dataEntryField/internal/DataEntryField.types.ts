import type { ValidatorContainer } from './dataEntryField.utils';

export type ValueMetaInput = {
    validationError?: string;
    isValid: boolean;
    touched: boolean;
    type: string;
};

export type ValueMetaUpdateOutput = {
    validationError?: string;
    isValid: boolean;
    touched: boolean;
};

export type Props = {
    dataEntryId: string;
    completionAttempted?: boolean;
    saveAttempted?: boolean;
    Component: React.ComponentType<any>;
    validatorContainers?: Array<ValidatorContainer>;
    propName: string;
    onUpdateField?: (
        innerAction: any, 
        data: { value: any; valueMeta: ValueMetaUpdateOutput; fieldId: string; dataEntryId: string; itemId: string }
    ) => void;
    value: any;
    valueMeta: ValueMetaInput;
    itemId: string;
    onUpdateFieldInner: (
        value: any, 
        valueMeta: ValueMetaUpdateOutput, 
        fieldId: string, 
        dataEntryId: string, 
        itemId: string, 
        onUpdateField?: (
            innerAction: any, 
            data: { value: any; valueMeta: ValueMetaUpdateOutput; fieldId: string; dataEntryId: string; itemId: string }
        ) => void
    ) => void;
    componentProps: Record<string, any>;
};

export type Options = {
    touched?: boolean;
    error?: string;
    errorCode?: string;
};

export type ContainerProps = {
    dataEntryId: string;
    completionAttempted?: boolean;
    saveAttempted?: boolean;
    propName: string;
};
