import log from 'loglevel';
import { errorCreator, buildUrl } from 'capture-core-utils';
import { useState, useCallback, useEffect } from 'react';
import { useDataEngine, useConfig } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { convertValue as convertServerToClient } from '../../../converters/serverToClient';
import { subValueGetterByElementType } from './getSubValueForTei';
import { Option } from '../../../metaData';
import { isMultiTextWithoutOptionset } from '../../../metaDataMemoryStoreBuilders/common/helpers/dataElement/unsupportedMultiText';

export type InputProgramData = {
    id: string;
    programTrackedEntityAttributes: Array<{
        trackedEntityAttribute: {
            id: string;
            displayFormName?: string | null;
            optionSet?: {
                id: string | null;
                options: Array<Option>;
            } | null;
            valueType: string;
            unique: boolean;
        };
        displayInList: boolean;
    }>;
};

export type InputAttribute = {
    attribute: string;
    code: string;
    createdAt: string;
    displayName: string;
    lastUpdated: string;
    value: string;
    valueType: string;
};

export type AttributeWithSubvalue = {
    attribute: string;
    key?: string;
    optionSet?: any;
    displayInList: boolean;
    value: any;
    unique: boolean;
    valueType: string;
};

const MULIT_TEXT_WITH_NO_OPTIONS_SET =
    'could not create the metadata because a MULIT_TEXT without associated option sets was found';

export const useClientAttributesWithSubvalues = (
    teiId: string, 
    program: InputProgramData, 
    trackedEntityInstanceAttributes: Array<InputAttribute>
): AttributeWithSubvalue[] => {
    const dataEngine = useDataEngine();
    const { baseUrl, apiVersion } = useConfig();
    const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);

    const [listAttributes, setListAttributes] = useState<AttributeWithSubvalue[]>([]);

    const getListAttributes = useCallback(async () => {
        if (program && trackedEntityInstanceAttributes) {
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const { programTrackedEntityAttributes } = program;
            const computedAttributes = await programTrackedEntityAttributes.reduce(async (promisedAcc, currentTEA) => {
                const {
                    displayInList,
                    trackedEntityAttribute: { id, optionSet, valueType, unique, displayFormName },
                } = currentTEA;
                const foundAttribute = trackedEntityInstanceAttributes?.find(item => item.attribute === id);
                let value;
                if (foundAttribute) {
                    if (subValueGetterByElementType[valueType]) {
                        value = await subValueGetterByElementType[valueType]({
                            attribute: {
                                value: foundAttribute.value,
                                id,
                                teiId,
                                programId: program.id,
                                absoluteApiPath,
                            },
                            querySingleResource,
                        });
                    } else {
                        value = convertServerToClient(foundAttribute.value, valueType);
                    }
                }

                const acc = await promisedAcc;

                if (isMultiTextWithoutOptionset(valueType, optionSet)) {
                    log.error(errorCreator(MULIT_TEXT_WITH_NO_OPTIONS_SET)({ optionSet }));
                    return acc;
                }
                return [
                    ...acc,
                    {
                        attribute: id,
                        key: displayFormName,
                        optionSet,
                        displayInList,
                        value,
                        unique,
                        valueType,
                    },
                ] as AttributeWithSubvalue[];
            }, Promise.resolve([] as AttributeWithSubvalue[]));

            setListAttributes(computedAttributes);
        }
    }, [program, trackedEntityInstanceAttributes, dataEngine, teiId, absoluteApiPath]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);

    return listAttributes;
};
