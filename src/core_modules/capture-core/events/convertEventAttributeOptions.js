// @flow

import { FEATURES, hasAPISupportForFeature } from '../../capture-core-utils';

const attributeCategoryKey = 'attributeCategoryOptions';
export const convertEventAttributeOptions = (event: Object, serverMinorVersion: number) => {
    const editedAttributeOptions = Object.keys(event)
        .filter(key => key.startsWith(`${attributeCategoryKey}-`));

    if (editedAttributeOptions.length > 0) {
        const useNewAocApiSeparator = hasAPISupportForFeature(serverMinorVersion, FEATURES.newAocApiSeparator);
        const newAttributeCategoryOptions = [];
        editedAttributeOptions.forEach((key) => {
            newAttributeCategoryOptions.push(event[key]);
            delete event[key];
        });
        return {
            ...event,
            attributeCategoryOptions: newAttributeCategoryOptions.join(useNewAocApiSeparator ? ',' : ';'),
        };
    }
    return event;
};
