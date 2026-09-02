import { customTerms } from '../../../utils/customTerms';

export const NotEnoughAttributesMessage = ({
    minAttributesRequiredToSearch,
    searchableFields,
    attributesLabel,
    attributeLabel,
}: {
    minAttributesRequiredToSearch: number;
    searchableFields: Array<Record<string, unknown>>;
    attributesLabel: string;
    attributeLabel: string;
}) => {
    const searchableFieldsDisplayname = searchableFields?.map((field: any) => field.formName)?.join(', ');

    if (minAttributesRequiredToSearch === searchableFields.length && searchableFields.length > 1) {
        return customTerms.i18n.t('Fill in these {{attributesLabel}} to search{{escape}} {{ searchableAttributes }}', {
            escape: ':',
            attributesLabel,
            searchableAttributes: searchableFieldsDisplayname,
        });
    }
    if (searchableFields.length > 1) {
        return customTerms.i18n.t(
            // eslint-disable-next-line max-len
            'Fill in at least {{minAttributesRequiredToSearch}} of these {{attributesLabel}} to search{{escape}} {{searchableAttributes}}',
            {
                escape: ':',
                minAttributesRequiredToSearch,
                attributesLabel,
                searchableAttributes: searchableFieldsDisplayname,
            },
        );
    }
    return customTerms.i18n.t('Fill in this {{attributeLabel}} to search{{escape}} {{searchableAttributes}}', {
        escape: ':',
        attributeLabel,
        searchableAttributes: searchableFieldsDisplayname,
    });
};

