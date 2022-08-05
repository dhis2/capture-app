// @flow
import { useState, useEffect, useRef } from 'react';
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { getUniqueValuesForAttributesWithoutValue } from '../../../DataEntries/common/TEIAndEnrollment';
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
    const uniqueValues = await getUniqueValuesForAttributesWithoutValue(foundation, clientAttributesWithSubvalues, staticPatternValues);
    setFormValues && setFormValues({ ...formValues, ...uniqueValues });
    setClientValues && setClientValues({ ...clientValues, ...uniqueValues });
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
            orgUnit?.id &&
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
