// @flow
import i18n from '@dhis2/d2-i18n';
import {
    RenderFoundation,
    dataElementTypes as elementTypeKeys,
} from '../../../../../metaData';
import mainPropertyNames from '../../../../../events/mainPropertyNames.const';

export const getDefaultMainConfig = () => [
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

export const getMetaDataConfig = (stage: RenderFoundation): Array<{id: string, visible: boolean}> =>
    stage
        .getElements()
        .map(element => ({
            id: element.id,
            visible: element.displayInReports,
        }));

