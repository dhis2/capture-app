// @flow
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { getUniqueValuesForAttributesWithoutValue } from '../../common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToForm, convertServerToClient } from '../../../../converters';
import { subValueGetterByElementType } from './getSubValueForTei';

type InputProgramData = {
    attributes: Array<{
        id: string,
        formName?: ?string,
        optionSet?: ?{
            id: string,
            options?: ?Array<{
                code: string,
                name: string,
            }>,
        },
        type: string,
        unique: boolean,
    }>,
};

type InputAttribute = {
    attribute: string,
    code: string,
    created: string,
    displayName: string,
    lastUpdated: string,
    value: string,
    valueType: string,
};

type InputForm = {
    program: InputProgramData,
    trackedEntityInstanceAttributes: Array<InputAttribute>,
    orgUnit: OrgUnit,
    formFoundation: RenderFoundation,
    teiId: ?string,
};

type StaticPatternValues = {
    orgUnitCode: string,
};

const useClientAttributesWithSubvalues = (program: InputProgramData, attributes: Array<InputAttribute>) => {
    const dataEngine = useDataEngine();
    const [listAttributes, setListAttributes] = useState([]);

    const getListAttributes = useCallback(async () => {
        if (program && attributes) {
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const { attributes: programTrackedEntityAttributes } = program;
            const computedAttributes = await programTrackedEntityAttributes?.reduce(async (promisedAcc, programTrackedEntityAttribute) => {
                const { id, formName, optionSet, type, unique } = programTrackedEntityAttribute;
                const foundAttribute = attributes?.find(item => item.attribute === id);
                let value;
                if (foundAttribute) {
                    if (subValueGetterByElementType[type]) {
                        value = await subValueGetterByElementType[type](foundAttribute.value, querySingleResource);
                    } else {
                        // $FlowFixMe dataElementTypes flow error
                        value = convertServerToClient(foundAttribute.value, type);
                    }
                }

                const acc = await promisedAcc;
                return [
                    ...acc,
                    {
                        attribute: id,
                        key: formName,
                        optionSet,
                        value,
                        unique,
                        valueType: type,
                    },
                ];
            }, Promise.resolve([]));
            setListAttributes(computedAttributes);
        }
    }, [program, attributes, dataEngine]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);

    return listAttributes;
};

const buildFormValues = async (
    foundation: ?RenderFoundation,
    clientAttributesWithSubvalues: Array<any>,
    staticPatternValues: StaticPatternValues,
    setFormValues: (values: any) => void,
    setClientValues: (values: any) => void,
    formValuesReadyRef: { current: boolean },
) => {
    const clientValues = clientAttributesWithSubvalues?.reduce((acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }), {});
    const formValues = clientAttributesWithSubvalues?.reduce(
        (acc, currentValue) => ({ ...acc, [currentValue.attribute]: convertClientToForm(currentValue.value, currentValue.valueType) }),
        {},
    );
    const uniqueValues = await getUniqueValuesForAttributesWithoutValue(foundation, clientAttributesWithSubvalues, staticPatternValues);
    setFormValues && setFormValues({ ...formValues, ...uniqueValues });
    setClientValues && setClientValues({ ...clientValues, ...uniqueValues });
    formValuesReadyRef.current = true;
};

export const useFormValues = ({ program, trackedEntityInstanceAttributes, orgUnit, formFoundation, teiId }: InputForm) => {
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(program, trackedEntityInstanceAttributes);
    const formValuesReadyRef = useRef<any>(false);
    const [formValues, setFormValues] = useState<any>({});
    const [clientValues, setClientValues] = useState<any>({});

    useEffect(() => {
        if (
            orgUnit?.code &&
            Object.entries(formFoundation).length > 0 &&
            formValuesReadyRef.current === false &&
            ((teiId && clientAttributesWithSubvalues.length > 0) || !teiId)
        ) {
            const staticPatternValues = { orgUnitCode: orgUnit.code };
            buildFormValues(formFoundation, clientAttributesWithSubvalues, staticPatternValues, setFormValues, setClientValues, formValuesReadyRef);
        }
    }, [formFoundation, clientAttributesWithSubvalues, formValues, formValuesReadyRef, orgUnit, teiId]);

    return { formValues, clientValues, formValuesReadyRef };
};
