// @flow
import { useState, useCallback, useEffect } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { convertValue as convertServerToClient } from '../../../converters/serverToClient';
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
        if (program && trackedEntityInstances) {
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const { programTrackedEntityAttributes } = program;
            const { attributes } = trackedEntityInstances;
            const computedAttributes = await programTrackedEntityAttributes.reduce(async (promisedAcc, currentTEA) => {
                const {
                    displayInList,
                    trackedEntityAttribute: { id, displayName, optionSet, valueType },
                } = currentTEA;
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
                        key: displayName,
                        optionSet,
                        displayInList,
                        value,
                        valueType: foundAttribute?.valueType || valueType,
                    },
                ];
            }, Promise.resolve([]));

            setListAttributes(computedAttributes);
        }
    }, [program, trackedEntityInstances, dataEngine]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);

    return listAttributes;
};
