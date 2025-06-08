import type { ReactNode } from 'react';

export type ErrorData = {
    id?: string;
    tetId?: string;
    attributeValueExistsUnsaved?: boolean;
};

export type PostProcessErrorMessage = (params: {
    errorMessage: string | Array<string> | Array<{[key: string]: string}>;
    errorType?: string;
    errorData?: ErrorData;
    id: string;
    fieldId: string;
    fieldLabel: string;
}) => string | Array<string> | Array<{[key: string]: string}> | ReactNode;
