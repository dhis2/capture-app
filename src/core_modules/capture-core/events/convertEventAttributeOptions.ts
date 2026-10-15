// DHIS2-22219: delete this file once events send a resolved `attributeOptionCombo` instead of a `attributeCategoryOptions` CSV.
const attributeCategoryKey = 'attributeCategoryOptions';
export const convertEventAttributeOptions = (event: any) => {
    const editedAttributeOptions = Object.keys(event)
        .filter(key => key.startsWith(`${attributeCategoryKey}-`));

    if (editedAttributeOptions.length > 0) {
        const newAttributeCategoryOptions: any[] = [];
        editedAttributeOptions.forEach((key) => {
            newAttributeCategoryOptions.push(event[key]);
            delete event[key];
        });
        return {
            ...event,
            attributeCategoryOptions: newAttributeCategoryOptions.join(','),
        };
    }
    return event;
};
