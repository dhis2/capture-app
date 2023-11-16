// @flow
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getUniqueValuesForAttributesWithoutValue } from '../../common/TEIAndEnrollment';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToForm, convertServerToClient } from '../../../../converters';
import { subValueGetterByElementType } from './getSubValueForTei';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import { dataElementTypes } from '../../../../metaData';

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

export type InputAttribute = {
    attribute: string,
    code: string,
    created: string,
    displayName: string,
    lastUpdated: string,
    value: string,
    valueType: $Keys<typeof dataElementTypes>,
};

type InputForm = {
    program: InputProgramData,
    trackedEntityInstanceAttributes: Array<InputAttribute>,
    orgUnit: ?OrgUnit,
    formFoundation: RenderFoundation,
    teiId: ?string,
    searchTerms: ?Array<{[key: string]: string}>
};

type StaticPatternValues = {
    orgUnitCode: string,
};

const useClientAttributesWithSubvalues = (program: InputProgramData, attributes: Array<InputAttribute>) => {
    const dataEngine = useDataEngine();
    const [listAttributes, setListAttributes] = useState(null);

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
        } else {
            setListAttributes([]);
        }
    }, [program, attributes, dataEngine]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);

    return listAttributes;
};

const buildFormValues = async ({
    foundation,
    clientAttributesWithSubvalues,
    staticPatternValues,
    setFormValues,
    setClientValues,
    formValuesReadyRef,
    searchTerms,
    querySingleResource,
}: {
    foundation: ?RenderFoundation,
    clientAttributesWithSubvalues: Array<any>,
    staticPatternValues: StaticPatternValues,
    setFormValues: (values: any) => void,
    setClientValues: (values: any) => void,
    formValuesReadyRef: { current: boolean },
    searchTerms?: ?Array<{[key: string]: any}>,
    querySingleResource: QuerySingleResource,
}) => {
    const clientValues = clientAttributesWithSubvalues?.reduce((acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }), {});
    const formValues = clientAttributesWithSubvalues?.reduce(
        (acc, currentValue) => ({ ...acc, [currentValue.attribute]: convertClientToForm(currentValue.value, currentValue.valueType) }),
        {},
    );
    const searchClientValues = searchTerms?.reduce((acc, item) => ({ ...acc, [item.id]: item.value }), {});
    const searchFormValues = searchTerms?.reduce((acc, item) => ({ ...acc, [item.id]: convertClientToForm(item.value, item.type) }), {});

    const uniqueValues = await getUniqueValuesForAttributesWithoutValue(
        foundation,
        clientAttributesWithSubvalues,
        staticPatternValues,
        querySingleResource,
    );
    setFormValues && setFormValues({ ...searchFormValues, ...formValues, ...uniqueValues });
    setClientValues && setClientValues({ ...searchClientValues, ...clientValues, ...uniqueValues });
    formValuesReadyRef.current = true;
};

export const useFormValues = ({ program, trackedEntityInstanceAttributes, orgUnit, formFoundation, teiId, searchTerms }: InputForm) => {
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(program, trackedEntityInstanceAttributes);
    const dataEngine = useDataEngine();
    const formValuesReadyRef = useRef<any>(false);
    const [formValues, setFormValues] = useState<any>({});
    const [clientValues, setClientValues] = useState<any>({});

    useEffect(() => {
        formValuesReadyRef.current = false;
    }, [teiId]);

    useEffect(() => {
        if (
            orgUnit?.id &&
            formFoundation &&
            Object.entries(formFoundation).length > 0 &&
            formValuesReadyRef.current === false &&
            !!clientAttributesWithSubvalues
        ) {
            const staticPatternValues = { orgUnitCode: orgUnit.code };
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            buildFormValues({
                foundation: formFoundation,
                clientAttributesWithSubvalues,
                staticPatternValues,
                setFormValues,
                setClientValues,
                formValuesReadyRef,
                searchTerms,
                querySingleResource,
            });
        }
    }, [
        formFoundation,
        clientAttributesWithSubvalues,
        formValuesReadyRef,
        orgUnit,
        searchTerms,
        dataEngine,
    ]);


    return { formValues, clientValues, formValuesReadyRef };
};
