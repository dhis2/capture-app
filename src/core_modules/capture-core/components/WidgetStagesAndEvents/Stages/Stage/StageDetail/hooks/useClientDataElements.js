// @flow
import { useMemo } from 'react';
import { convertValue } from 'capture-core/converters/serverToClient';
import type { StageDataElement, StageDataElementClient } from '../../../../types/common.types';

const convertToClientDataElement = (dataElement: StageDataElement): StageDataElementClient => {
    const { options, type, ...rest } = dataElement;

    const convertedOptions = options
        ? Object.entries(options).map(([key, value]) => ({
            value: convertValue(key, type),
            text: value,
        }))
        : [];

    return {
        ...rest,
        type,
        options: convertedOptions,
    };
};

export const useClientDataElements = (dataElements: Array<StageDataElement>) =>
    useMemo < Array<StageDataElementClient>>(() => {
        if (!dataElements) {
            return [];
        }
        return dataElements.map(convertToClientDataElement);
    }, [dataElements]);
