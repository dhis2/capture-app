import type { ReactNode } from 'react';
import type { ValidatorContainer } from '../../../utils/validation';

export type ErrorData = {
    id?: string | null;
    tetId?: string | null;
    attributeValueExistsUnsaved?: boolean | null;
};

export type PostProcessErrorMessage = (params: {
    errorMessage: string | Array<string> | Array<{[key: string]: string}>;
    errorType?: string | null;
    errorData?: ErrorData;
    id: string;
    fieldId: string;
    fieldLabel: string;
}) => string | Array<string> | Array<{[key: string]: string}> | ReactNode;

export type FieldConfig = {
    id: string;
    component: React.ComponentType<any>;
    plugin?: boolean;
    props: any;
    validators?: Array<ValidatorContainer>;
    commitEvent?: string | null;
    onIsEqual?: ((newValue: any, oldValue: any) => boolean) | null;
};

export type FieldCommitOptions = {
    readonly touched?: boolean;
    readonly valid?: boolean;
    readonly error?: string | Array<string> | Array<{[key: string]: string}>;
    readonly errorCode?: string;
};

export type FieldCommitOptionsExtended = {
    readonly plugin?: boolean | null;
} & FieldCommitOptions;
