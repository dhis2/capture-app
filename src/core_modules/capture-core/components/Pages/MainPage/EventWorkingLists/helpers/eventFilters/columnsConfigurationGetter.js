// @flow
import type { ColumnConfig } from '../../../WorkingLists';

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
            if (orderElement.apiName) {
                acc.set(orderElement.apiName, orderElement);
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
    customOrder?: ?Array<string>,
    defaultConfig: Map<string, Object>,
): Array<ColumnConfig> => {
    const defaultOrderConfig = [...defaultConfig.entries()].map(entry => entry[1]);
    if (customOrder && customOrder.length > 0) {
        return getCustomColumnsConfiguration(defaultOrderConfig, customOrder);
    }

    return defaultOrderConfig;
};
