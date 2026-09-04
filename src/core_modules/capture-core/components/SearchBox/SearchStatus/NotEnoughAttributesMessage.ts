import i18n from '@dhis2/d2-i18n';

export const NotEnoughAttributesMessage = ({
    minAttributesRequiredToSearch,
    searchableFields,
    attributesLabel,
}: {
    minAttributesRequiredToSearch: number;
    searchableFields: Array<Record<string, unknown>>;
    attributesLabel: string;
}) => {
    const searchableFieldsDisplayname = searchableFields?.map((field: any) => field.formName)?.join(', ');

    if (minAttributesRequiredToSearch === searchableFields.length && searchableFields.length > 1) {
        return i18n.t('Fill in these {{attributesLabel}} to search{{escape}} {{ searchableAttributes }}', {
            escape: ':',
            attributesLabel,
            searchableAttributes: searchableFieldsDisplayname,
        });
    }
    if (searchableFields.length > 1) {
        return i18n.t(
            'Fill in at least {{minAttributesRequiredToSearch}} of these {{attributesLabel}} to search{{escape}}'
            + ' {{searchableAttributes}}',
            {
                escape: ':',
                minAttributesRequiredToSearch,
                attributesLabel,
                searchableAttributes: searchableFieldsDisplayname,
            },
        );
    }
    return i18n.t('Fill in this attribute to search{{escape}} {{searchableAttributes}}', {
        escape: ':',
        searchableAttributes: searchableFieldsDisplayname,
    });
};

