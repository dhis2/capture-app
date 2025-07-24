import type { ReactNode } from 'react';

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
