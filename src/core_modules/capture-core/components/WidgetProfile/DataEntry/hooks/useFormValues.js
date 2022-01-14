// @flow
import { useState, useEffect, useRef } from 'react';
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { getGeneratedUniqueValuesAsync } from '../../../DataEntries/common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToForm } from '../../../../converters';

type StaticPatternValues = {
    orgUnitCode: string,
};

const mergeUniqueValues = (uniqueValues, apiValues) =>
    Object.keys(apiValues).reduce((acc, key) => {
        const uniqueValue = uniqueValues.find(value => value.id === key);
        return uniqueValue && apiValues[key] === undefined ? { ...acc, [key]: uniqueValue.item.value } : { ...acc, [key]: apiValues[key] };
    }, {});

const shouldGenerateUniqueValues = clientAttributesWithSubvalues =>
    !clientAttributesWithSubvalues.every(attribute => (attribute.unique && attribute.value) || !attribute.unique);

const buildFormValues = async (
    foundation: ?RenderFoundation,
    clientAttributesWithSubvalues: Array<any> = [],
    staticPatternValues: StaticPatternValues,
    setFormValues: (values: any) => void,
    setClientValues: (values: any) => void,
) => {
    let clientValues = clientAttributesWithSubvalues?.reduce((acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }), {});
    let formValues = clientAttributesWithSubvalues?.reduce(
        (acc, currentValue) => ({ ...acc, [currentValue.attribute]: convertClientToForm(currentValue.value, currentValue.valueType) }),
        {},
    );

    if (shouldGenerateUniqueValues(clientAttributesWithSubvalues)) {
        const generatedUniqueValues = await getGeneratedUniqueValuesAsync(foundation, {}, staticPatternValues);
        formValues = mergeUniqueValues(generatedUniqueValues, formValues);
        clientValues = mergeUniqueValues(generatedUniqueValues, clientValues);
    }
    setFormValues && setFormValues(formValues);
    setClientValues && setClientValues(clientValues);
};

export const useFormValues = ({
    formFoundation,
    orgUnit,
    clientAttributesWithSubvalues,
}: {
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    clientAttributesWithSubvalues: Array<any>,
}) => {
    const [formValues, setFormValues] = useState<any>({});
    const [clientValues, setClientValues] = useState<any>({});
    const formValuesReadyRef = useRef(false);

    useEffect(() => {
        if (
            orgUnit &&
            orgUnit.code &&
            Object.entries(formFoundation).length > 0 &&
            Object.entries(formValues).length === 0 &&
            formValuesReadyRef.current === false
        ) {
            const staticPatternValues = { orgUnitCode: orgUnit.code };
            formValuesReadyRef.current = true;
            buildFormValues(formFoundation, clientAttributesWithSubvalues, staticPatternValues, setFormValues, setClientValues);
        }
    }, [formFoundation, clientAttributesWithSubvalues, formValues, formValuesReadyRef, orgUnit]);

    return { formValues, clientValues };
};
