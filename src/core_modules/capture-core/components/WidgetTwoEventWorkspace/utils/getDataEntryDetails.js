// @flow
import React from 'react';
import { pipe } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes, type RenderFoundation } from '../../../metaData';
import { convertClientToView, convertServerToClient } from '../../../converters';
import type { LinkedEvent } from '../WidgetTwoEventWorkspace.types';
import { FlatListOrgUnitField } from '../FlatListOrgUnitField';

const convertFn = pipe(convertServerToClient, convertClientToView);

export const Placements = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
};

const StatusLabels = {
    ACTIVE: i18n.t('Active'),
    COMPLETED: i18n.t('Completed'),
    CANCELLED: i18n.t('Cancelled'),
    SCHEDULE: i18n.t('Scheduled'),
};

const DataEntryFieldsToInclude = {
    occurredAt: {
        apiKey: 'occurredAt',
        type: dataElementTypes.DATE,
        placement: Placements.TOP,
    },
    scheduledAt: {
        apiKey: 'scheduledAt',
        type: dataElementTypes.DATE,
        placement: Placements.TOP,
    },
    orgUnit: {
        apiKey: 'orgUnit',
        type: dataElementTypes.ORGANISATION_UNIT,
        placement: Placements.TOP,
        label: i18n.t('Organisation unit'),
        convertFn: orgUnitId => <FlatListOrgUnitField orgUnitId={orgUnitId} />,
    },
    status: {
        apiKey: 'status',
        type: dataElementTypes.TEXT,
        placement: Placements.BOTTOM,
        label: i18n.t('Status'),
        convertFn: value => StatusLabels[value],
    },
};

export const getDataEntryDetails = (linkedEvent: LinkedEvent, formFoundation: RenderFoundation) => {
    const dataEntryValues = Object.values(DataEntryFieldsToInclude).map((entry: any) => {
        const value = linkedEvent[entry.apiKey];
        if (!value) return null;

        const convertedValue = entry.convertFn ? entry.convertFn(value) : convertFn(value, entry.type);

        return {
            key: entry.label ?? formFoundation.getLabel(entry.apiKey),
            value: convertedValue,
            reactKey: entry.apiKey,
            placement: entry.placement,
        };
    });

    return dataEntryValues.reduce((acc, entry) => {
        if (!entry) return acc;
        acc[entry.placement].push(entry);
        return acc;
    }, {
        [Placements.TOP]: [],
        [Placements.BOTTOM]: [],
    });
};
