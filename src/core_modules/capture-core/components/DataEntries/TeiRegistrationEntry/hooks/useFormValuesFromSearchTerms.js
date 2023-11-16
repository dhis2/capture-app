// @flow
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { convertClientToForm } from '../../../../converters';
import type { InputAttribute } from '../../EnrollmentRegistrationEntry/hooks/useFormValues';

type Props = {
    inheritedAttributes: ?Array<InputAttribute>,
};

export const useFormValuesFromSearchTerms = ({ inheritedAttributes }: Props) => {
    const searchTerms = useSelector(({ searchDomain }) => searchDomain.currentSearchInfo.currentSearchTerms);

    return useMemo(() => {
        if (inheritedAttributes) {
            return inheritedAttributes
                ?.reduce((acc, item) => {
                    acc[item.attribute] = convertClientToForm(item.value, item.valueType);
                    return acc;
                }, {});
        }
        if (searchTerms) {
            return searchTerms
                ?.reduce((acc, item) => {
                    acc[item.id] = convertClientToForm(item.value, item.type);
                    return acc;
                }, {});
        }

        return null;
    }, [inheritedAttributes, searchTerms]);
};
