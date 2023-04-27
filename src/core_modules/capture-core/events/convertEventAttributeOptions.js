// @flow

const attributeCategoryKey = 'attributeCategoryOptions';
export const convertEventAttributeOptions = (event: Object) => {
    const editedAttributeOptions = Object.keys(event)
        .filter(key => key.startsWith(`${attributeCategoryKey}-`));

    if (editedAttributeOptions.length > 0) {
        const newAttributeCategoryOptions = [];
        editedAttributeOptions.forEach((key) => {
            newAttributeCategoryOptions.push(event[key]);
            delete event[key];
        });
        return {
            ...event,
            attributeCategoryOptions: newAttributeCategoryOptions.join(';'),
        };
    }
    return event;
};
