import { useState, useEffect, useRef } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { getUniqueValuesForAttributesWithoutValue } from '../../../DataEntries/common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToForm } from '../../../../converters';
import type { StaticPatternValues } from './hooks.types';

const buildFormValues = async ({
    foundation,
    clientAttributesWithSubvalues = [],
    staticPatternValues,
    setFormValues,
    setClientValues,
    querySingleResource,
}: {
    foundation: RenderFoundation | null;
    clientAttributesWithSubvalues: Array<any>;
    staticPatternValues: StaticPatternValues;
    setFormValues: (values: any) => void;
    setClientValues: (values: any) => void;
    querySingleResource: any;
}) => {
    const clientValues = clientAttributesWithSubvalues?.reduce(
        (acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }),
        {}
    );
    const formValues = clientAttributesWithSubvalues?.reduce(
        (acc, currentValue) => ({
            ...acc,
            [currentValue.attribute]: convertClientToForm(currentValue.value, currentValue.valueType)
        }),
        {},
    );
    const uniqueValues = await getUniqueValuesForAttributesWithoutValue(
        foundation,
        clientAttributesWithSubvalues,
        staticPatternValues,
        querySingleResource,
    );
    setFormValues && setFormValues({ ...formValues, ...uniqueValues });
    setClientValues && setClientValues({ ...clientValues, ...uniqueValues });
};

export const useFormValues = ({
    formFoundation,
    orgUnit,
    clientAttributesWithSubvalues,
}: {
    formFoundation: RenderFoundation;
    orgUnit: any;
    clientAttributesWithSubvalues: Array<any>;
}) => {
    const [formValues, setFormValues] = useState<any>({});
    const [clientValues, setClientValues] = useState<any>({});
    const formValuesReadyRef = useRef(false);
    const dataEngine = useDataEngine();

    useEffect(() => {
        if (
            orgUnit?.id &&
            Object.entries(formFoundation).length > 0 &&
            Object.entries(formValues).length === 0 &&
            formValuesReadyRef.current === false
        ) {
            const staticPatternValues = { orgUnitCode: orgUnit.code };
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            formValuesReadyRef.current = true;
            buildFormValues({
                foundation: formFoundation,
                clientAttributesWithSubvalues,
                staticPatternValues,
                setFormValues,
                setClientValues,
                querySingleResource,
            });
        }
    }, [formFoundation, clientAttributesWithSubvalues, formValues, formValuesReadyRef, orgUnit, dataEngine]);

    return { formValues, clientValues };
};
