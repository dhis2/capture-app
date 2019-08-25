// @flow
import {
    ProgramStage,
} from '../../../../../metaData';
import { getDefaultMainConfig, getMetaDataConfig } from '../defaultColumnConfiguration';
import type { ColumnConfig } from '../eventList.types';

const getCustomConfig = (
    customOrder: Array<string>,
    defaultConfigOrderAsHashMapById: Map<string, Object>,
    defaultConfigOrderAsHashMapByConfigName: Map<string, Object>,
) =>
    customOrder
        .reduce((acc, elementKey) => {
            let element = defaultConfigOrderAsHashMapById.get(elementKey);
            if (!element) {
                element = defaultConfigOrderAsHashMapByConfigName.get(elementKey);
            }
            if (element) {
                acc.set(element.id, {
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
    const defaultConfigOrderAsHashMapById = defaultConfig
        .reduce((acc, orderElement) => {
            acc.set(orderElement.id, orderElement);
            return acc;
        }, new Map());

    const defaultConfigOrderAsHashMapByConfigName = defaultConfig
        .reduce((acc, orderElement) => {
            if (orderElement.nameInConfig) {
                acc.set(orderElement.nameInConfig, orderElement);
            }
            return acc;
        }, new Map());

    const customConfigAsHashMap = getCustomConfig(
        customOrder,
        defaultConfigOrderAsHashMapById,
        defaultConfigOrderAsHashMapByConfigName,
    );
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
    stage: ProgramStage,
    customOrder?: ?Array<string>,
): Array<ColumnConfig> => {
    const defaultConfig = [
        ...getDefaultMainConfig(stage),
        ...getMetaDataConfig(stage.stageForm),
    ];

    if (customOrder && customOrder.length > 0) {
        return getCustomColumnsConfiguration(defaultConfig, customOrder);
    }

    return defaultConfig;
};
