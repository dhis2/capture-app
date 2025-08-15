import { FEATURES, featureAvailable } from '../../capture-core-utils';

const attributeCategoryKey = 'attributeCategoryOptions';
export const convertEventAttributeOptions = (event: any) => {
    const editedAttributeOptions = Object.keys(event)
        .filter(key => key.startsWith(`${attributeCategoryKey}-`));

    if (editedAttributeOptions.length > 0) {
        const newUIDsSeparator = featureAvailable(FEATURES.newUIDsSeparator);
        const newAttributeCategoryOptions: any[] = [];
        editedAttributeOptions.forEach((key) => {
            newAttributeCategoryOptions.push(event[key]);
            delete event[key];
        });
        return {
            ...event,
            attributeCategoryOptions: newAttributeCategoryOptions.join(newUIDsSeparator ? ',' : ';'),
        };
    }
    return event;
};
