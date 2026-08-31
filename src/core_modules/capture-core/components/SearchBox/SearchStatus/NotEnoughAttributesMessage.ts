import { tCustomTerm } from '../../../utils/tCustomTerm';

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
        return tCustomTerm('Fill in these {{attributesLabel}} to search{{escape}} {{ searchableAttributes }}', {
            escape: ':',
            attributesLabel,
            searchableAttributes: searchableFieldsDisplayname,
        });
    }
    if (searchableFields.length > 1) {
        return tCustomTerm(
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
    return tCustomTerm('Fill in this {{attributeLabel}} to search{{escape}} {{searchableAttributes}}', {
        escape: ':',
        attributeLabel,
        searchableAttributes: searchableFieldsDisplayname,
    });
};

