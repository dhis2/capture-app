// @flow
import type { Node } from 'react';

export type ErrorData = {
    id?: ?string,
    tetId?: ?string,
    attributeValueExistsUnsaved?: ?boolean,
};
export type PostProcessErrorMessage = ({
    errorMessage: string | Array<string> | Array<{[key: string]: string}>,
    errorType: ?string,
    errorData?: ErrorData,
    id: string,
    fieldId: string,
    fieldLabel: string,
}) => string | Array<string> | Array<{[key: string]: string}> | Node;
