// @flow
import { useState, useEffect, useRef } from 'react';
import { getGeneratedUniqueValuesAsync } from '../../../DataEntries/common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';

type StaticPatternValues = {
    orgUnitCode: string,
};

const processFormValues = (trackedEntityInstanceAttributes: Array<any>) =>
    trackedEntityInstanceAttributes?.reduce((acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }), {});

const buildFormValues = async (
    foundation: ?RenderFoundation,
    trackedEntityInstanceAttributes: Array<any>,
    staticPatternValues: StaticPatternValues,
    setFormValues: (uniqueValues: any) => void,
) => {
    const formValues = processFormValues(trackedEntityInstanceAttributes);
    const generatedUniqueValues = await getGeneratedUniqueValuesAsync(foundation, {}, staticPatternValues);
    const uniqueValues = generatedUniqueValues.reduce((acc, currentValue) => ({ ...acc, [currentValue.id]: currentValue.item.value }), {});
    setFormValues && setFormValues({ ...uniqueValues, ...formValues });
};

export const useFormValues = ({
    formFoundation,
    staticPatternValues,
    trackedEntityInstanceAttributes,
}: {
    formFoundation: RenderFoundation,
    staticPatternValues: StaticPatternValues,
    trackedEntityInstanceAttributes: Array<any>,
}) => {
    const [formValues, setFormValues] = useState<any>({});
    const formValuesReadyRef = useRef(false);

    useEffect(() => {
        if (Object.entries(formFoundation).length > 0 && Object.entries(formValues).length === 0 && formValuesReadyRef.current === false) {
            formValuesReadyRef.current = true;
            buildFormValues(formFoundation, trackedEntityInstanceAttributes, staticPatternValues, setFormValues);
        }
    }, [staticPatternValues, formFoundation, trackedEntityInstanceAttributes, formValues, formValuesReadyRef]);

    return formValues;
};
