// @flow
import { useState, useEffect, useRef } from 'react';
import { getGeneratedUniqueValuesAsync } from '../../../DataEntries/common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToForm } from '../../../../converters';

type StaticPatternValues = {
    orgUnitCode: string,
};

const buildFormValues = async (
    foundation: ?RenderFoundation,
    clientAttributesWithSubvalues: Array<any> = [],
    staticPatternValues: StaticPatternValues,
    setFormValues: (values: any) => void,
    setClientValues: (values: any) => void,
) => {
    const clientValues = clientAttributesWithSubvalues?.reduce((acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }), {});
    const formValues = clientAttributesWithSubvalues?.reduce(
        (acc, currentValue) => ({ ...acc, [currentValue.attribute]: convertClientToForm(currentValue.value, currentValue.valueType) }),
        {},
    );

    const generatedUniqueValues = await getGeneratedUniqueValuesAsync(foundation, {}, staticPatternValues);
    const uniqueValues = generatedUniqueValues.reduce((acc, currentValue) => ({ ...acc, [currentValue.id]: currentValue.item.value }), {});

    setFormValues && setFormValues({ ...uniqueValues, ...formValues });
    setClientValues && setClientValues({ ...uniqueValues, ...clientValues });
};

export const useFormValues = ({
    formFoundation,
    staticPatternValues,
    clientAttributesWithSubvalues,
}: {
    formFoundation: RenderFoundation,
    staticPatternValues: StaticPatternValues,
    clientAttributesWithSubvalues: Array<any>,
}) => {
    const [formValues, setFormValues] = useState<any>({});
    const [clientValues, setClientValues] = useState<any>({});
    const formValuesReadyRef = useRef(false);

    useEffect(() => {
        if (Object.entries(formFoundation).length > 0 && Object.entries(formValues).length === 0 && formValuesReadyRef.current === false) {
            formValuesReadyRef.current = true;
            buildFormValues(formFoundation, clientAttributesWithSubvalues, staticPatternValues, setFormValues, setClientValues);
        }
    }, [staticPatternValues, formFoundation, clientAttributesWithSubvalues, formValues, formValuesReadyRef]);

    return { formValues, clientValues };
};
