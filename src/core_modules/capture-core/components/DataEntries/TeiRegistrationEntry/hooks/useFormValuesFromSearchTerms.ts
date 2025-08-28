import { useState } from 'react';
import { useSelector } from 'react-redux';
import { convertClientToForm } from '../../../../converters';
import type { InputAttribute } from '../../EnrollmentRegistrationEntry/hooks/useFormValues';

type Props = {
    inheritedAttributes?: Array<InputAttribute>;
};

export const useFormValuesFromSearchTerms = ({ inheritedAttributes }: Props) => {
    const searchTerms = useSelector(({ newPage }: any) => newPage.prepopulatedData);

    const [formValues] = useState(() => {
        if (inheritedAttributes) {
            return inheritedAttributes.reduce((acc, item) => {
                acc[item.attribute] = convertClientToForm(item.value, item.valueType);
                return acc;
            }, {});
        }

        if (searchTerms) {
            return searchTerms.reduce((acc: any, item: any) => {
                acc[item.id] = convertClientToForm(item.value, item.type);
                return acc;
            }, {});
        }

        return null;
    });

    return formValues;
};
