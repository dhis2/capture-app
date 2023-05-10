// @flow
import type { Node } from 'react';

export type ErrorData = {
    id?: ?string,
    tetId?: ?string,
    attributeValueExistsUnsaved?: ?boolean,
};
export type PostProcessErrorMessage = ({
    errorMessage: string | Array<string>,
    errorType: ?string,
    errorData?: ErrorData,
    id: string,
    fieldId: string,
    fieldLabel: string,
}) => Node;
