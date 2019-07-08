// @flow
import i18n from '@dhis2/d2-i18n';
import {
    RenderFoundation,
    dataElementTypes as elementTypeKeys,
} from '../../../../../metaData';
import mainPropertyNames from '../../../../../events/mainPropertyNames.const';
import type { ColumnConfig } from '../eventList.types';

const getDefaultMainConfig = () => [
    {
        id: mainPropertyNames.EVENT_DATE,
        visible: true,
        isMainProperty: true,
        type: elementTypeKeys.DATE,
    },
    {
        id: mainPropertyNames.EVENT_STATUS,
        header: 'Status',
        visible: true,
        isMainProperty: true,
        type: elementTypeKeys.TEXT,
        singleSelect: true,
        options: [
            { text: i18n.t('Active'), value: 'ACTIVE' },
            { text: i18n.t('Completed'), value: 'COMPLETED' },
        ],
    },
];

const getMetaDataConfig = (stage: RenderFoundation) =>
    stage
        .getElements()
        .map(element => ({
            id: element.id,
            visible: element.displayInReports,
        }));

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
    customOrder: ?Array<string>,
    stageForm: RenderFoundation,
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
