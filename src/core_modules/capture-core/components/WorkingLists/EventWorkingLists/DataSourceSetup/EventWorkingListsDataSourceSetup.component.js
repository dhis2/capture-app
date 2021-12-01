// @flow
import React from 'react';
import { EventWorkingListsTemplateSetup } from '../TemplateSetup';
import { useDataSource } from '../../WorkingListsCommon';
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
        rowIdKey="id"
    />
);
