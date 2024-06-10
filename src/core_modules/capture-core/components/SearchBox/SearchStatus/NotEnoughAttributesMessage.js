// @flow
import i18n from '@dhis2/d2-i18n';

export const NotEnoughAttributesMessage = ({
    minAttributesRequiredToSearch,
    searchableFields,
}: {
    minAttributesRequiredToSearch: number,
    searchableFields: Array<Object>,
}) => {
    const searchableFieldsDisplayname = searchableFields?.map(field => field.formName)?.join(', ');

    if (minAttributesRequiredToSearch === searchableFields.length && searchableFields.length > 1) {
        return i18n.t('Fill in these fields to search{{escape}} {{ searchableAttributes }}', {
            escape: ':',
            searchableAttributes: searchableFieldsDisplayname,
            interpolation: {
                escapeValue: false,
            },
        });
    }
    if (searchableFields.length > 1) {
        return i18n.t(
            'Fill in at least {{minAttributesRequiredToSearch}} of these fields to search{{escape}} {{searchableAttributes}}',
            {
                escape: ':',
                minAttributesRequiredToSearch,
                searchableAttributes: searchableFieldsDisplayname,
                interpolation: {
                    escapeValue: false,
                },
            },
        );
    }
    return i18n.t('Fill in this field to search{{escape}} {{searchableAttributes}}', {
        escape: ':',
        searchableAttributes: searchableFieldsDisplayname,
        interpolation: {
            escapeValue: false,
        },
    });
};
