// @flow
import { useMemo } from 'react';
import { convertValue } from 'capture-core/converters/serverToClient';
import type { StageDataElement, StageDataElementClient } from '../../../../types/common.types';

export const useClientDataElements = (dataElements: Array<StageDataElement>) =>
    useMemo(() => {
        if (!dataElements || !Array.isArray(dataElements)) {
            return [];
        }

        return dataElements.map <StageDataElementClient>(
            (dataElement: StageDataElement) => {
                const {
                    options,
                    type,
                    ...rest
                } = dataElement;

                const convertedOptions = options
                    ? Object.entries(options).map(([key, value]) => ({
                        value: convertValue(key, type),
                        text: value,
                    })) : undefined;

                return {
                    ...rest,
                    type,
                    options: convertedOptions,
                };
            });
    }, [dataElements]);
