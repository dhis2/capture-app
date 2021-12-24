// @flow
import { useState, useCallback, useEffect } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { useSelector } from 'react-redux';
import type { apiProgramTrackedEntityAttribute } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';
import { convertValue as convertServerToClient } from '../../converters/serverToClient';
import { subValueGetterByElementType } from './getSubValueForTei';

export const useProfileInfo = () => {
    const profileInformation = useSelector(({ enrollmentPage }) => enrollmentPage.profileInformation) ?? [];
    return { attributes: profileInformation };
};

type InputProgramData = {
    programs: {
        programTrackedEntityAttributes: Array<apiProgramTrackedEntityAttribute>
    }
}

type InputAttribute = {
    attribute: string,
    code: string,
    created: string,
    displayName: string,
    lastUpdated: string,
    value: string,
    valueType: string
}

type InputTEIData = {
    trackedEntityInstances: {
        attributes: Array<InputAttribute>
    }
}

export const useListAttributes = (programsData: InputProgramData, trackedEntityInstancesData: InputTEIData) => {
    const dataEngine = useDataEngine();

    const [listAttributes, setListAttributes] = useState([]);

    const getListAttributes = useCallback(async () => {
        if (programsData && trackedEntityInstancesData) {
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));

            const { programs: { programTrackedEntityAttributes } } = programsData;
            const { trackedEntityInstances: { attributes } } = trackedEntityInstancesData;
            const computedAttributes = await programTrackedEntityAttributes
                .filter(item => item.displayInList)
                .reduce(async (promisedAcc, currentTEA) => {
                    const { displayInList, trackedEntityAttribute: { id, displayName, optionSet } } = currentTEA;
                    const foundAttribute = attributes.find(item => item.attribute === id);
                    let value;
                    if (foundAttribute) {
                        if (subValueGetterByElementType[foundAttribute.valueType]) {
                            value = await subValueGetterByElementType[foundAttribute.valueType](
                                foundAttribute.value, querySingleResource,
                            );
                        } else {
                            // $FlowFixMe dataElementTypes flow error
                            value = convertServerToClient(foundAttribute.value, foundAttribute.valueType);
                        }
                    }

                    const acc = await promisedAcc;

                    return [...acc, {
                        reactKey: id,
                        key: displayName,
                        optionSet,
                        displayInList,
                        value,
                        valueType: foundAttribute?.valueType,
                    }];
                }, Promise.resolve([]));

            setListAttributes(computedAttributes);
        }
    }, [programsData, trackedEntityInstancesData, dataEngine]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);

    return listAttributes;
};
