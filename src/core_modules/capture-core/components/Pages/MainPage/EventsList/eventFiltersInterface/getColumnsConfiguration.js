// @flow
import {
    RenderFoundation,
} from '../../../../../metaData';
import { getDefaultMainConfig, getMetaDataConfig } from '../defaultColumnConfiguration';
import type { ColumnConfig } from '../eventList.types';

const getCustomConfig = (
    customOrder: Array<string>,
    defaultConfigOrderAsHashMap: Map<string, Object>,
) =>
    customOrder
        .reduce((acc, elementId) => {
            const element = defaultConfigOrderAsHashMap.get(elementId);
            if (element) {
                acc.set(elementId, {
                    ...element,
                    visible: true,
                });
            }
            return acc;
        }, new Map());

const getCustomColumnsConfiguration = (
    defaultConfig,
    customOrder,
) => {
    const defaultConfigOrderAsHashMap = defaultConfig
        .reduce((acc, orderElement) => {
            acc.set(orderElement.id, orderElement);
            return acc;
        }, new Map());
    const customConfigAsHashMap = getCustomConfig(customOrder, defaultConfigOrderAsHashMap);
    if (customConfigAsHashMap.size > 0) {
        const otherConfigElements = defaultConfig
            .filter(element => !customConfigAsHashMap.has(element.id))
            .map(element => ({
                ...element,
                visible: false,
            }));
        return [
            ...customConfigAsHashMap.values(),
            ...otherConfigElements,
        ];
    }
    return defaultConfig;
};

export const getColumnsConfiguration = (
    stageForm: RenderFoundation,
    customOrder?: ?Array<string>,
): Array<ColumnConfig> => {
    const defaultConfig = [
        ...getDefaultMainConfig(),
        ...getMetaDataConfig(stageForm),
    ];

    if (customOrder && customOrder.length > 0) {
        return getCustomColumnsConfiguration(defaultConfig, customOrder);
    }

    return defaultConfig;
};
