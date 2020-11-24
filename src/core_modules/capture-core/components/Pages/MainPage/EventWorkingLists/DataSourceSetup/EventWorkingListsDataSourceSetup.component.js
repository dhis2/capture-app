// @flow
import React from 'react';
import { useDataSource } from '../../EventWorkingListsCommon';
import { EventWorkingListsTemplateSetup } from '../TemplateSetup';
import type { Props } from './eventWorkingListsDataSourceSetup.types';

export const EventWorkingListsDataSourceSetup = ({
    records,
    columns,
    recordsOrder,
    ...passOnProps
}: Props) => (
    <EventWorkingListsTemplateSetup
        {...passOnProps}
        dataSource={useDataSource(records, recordsOrder, columns)}
        columns={columns}
        rowIdKey="eventId"
    />
);
