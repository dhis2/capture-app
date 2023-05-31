// @flow
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertClientToForm } from '../../../../converters';


export const useFormValuesFromSearchTerms = () => {
    const searchTerms = useSelector(({ searchDomain }) => searchDomain.currentSearchInfo.currentSearchTerms);
    const [formValues, setFormValues] = useState();
    useEffect(() => {
        if (searchTerms) {
            const searchFormValues = searchTerms
                ?.reduce((acc, item) => ({ ...acc, [item.id]: convertClientToForm(item.value, item.type) }), {});
            setFormValues(searchFormValues);
        }
    }, [searchTerms]);

    return formValues;
};
