// @flow
import { useState, useCallback, useEffect } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { convertValue as convertServerToClient } from '../../../../converters/serverToClient';
import { subValueGetterByElementType } from './getSubValueForTei';

type InputProgramData = {
    programTrackedEntityAttributes: Array<{
        trackedEntityAttribute: {
            id: string,
            displayName?: ?string,
            optionSet?: ?{
                id: string,
                options?: ?Array<{
                    code: string,
                    name: string,
                }>,
            },
            valueType?: string,
            unique: boolean,
        },
        displayInList: boolean,
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

type InputTEIData = {
    attributes: Array<InputAttribute>,
};

export const useClientAttributesWithSubvalues = (program: InputProgramData, trackedEntityInstances: InputTEIData) => {
    const dataEngine = useDataEngine();

    const [listAttributes, setListAttributes] = useState([]);

    const getListAttributes = useCallback(async () => {
        //console.log(program, trackedEntityInstances);
        if (program && trackedEntityInstances) {
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const { attributes: programTrackedEntityAttributes } = program;
            const { attributes } = trackedEntityInstances;
            const computedAttributes = await programTrackedEntityAttributes?.reduce(async (promisedAcc, currentTEA) => {
                const {
                    displayInForms, id, formName, optionSet, type, unique
                    //trackedEntityAttribute: { id, displayName, optionSet, valueType, unique },
                } = currentTEA;
                //console.log(displayInForms, id, formName, optionSet, type, unique, currentTEA)
                
                const foundAttribute = attributes.find(item => item.attribute === id);
                let value;
                if (foundAttribute) {
                    if (subValueGetterByElementType[foundAttribute.valueType]) {
                        value = await subValueGetterByElementType[foundAttribute.valueType](foundAttribute.value, querySingleResource);
                    } else {
                        // $FlowFixMe dataElementTypes flow error
                        value = convertServerToClient(foundAttribute.value, foundAttribute.valueType);
                    }
                }

                const acc = await promisedAcc;

                return [
                    ...acc,
                    {
                        attribute: id,
                        key: formName,
                        optionSet,
                        displayInList: true,
                        value,
                        unique,
                        valueType: foundAttribute?.valueType || type,
                    },
                ];
            }, Promise.resolve([]));
            console.log(computedAttributes)
            setListAttributes(computedAttributes);
        }
    }, [program, trackedEntityInstances, dataEngine]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);

    return listAttributes;
};
