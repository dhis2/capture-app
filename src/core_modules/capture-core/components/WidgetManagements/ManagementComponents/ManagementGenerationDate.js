// @flow
import React from 'react';
import { DataTableCell } from '@dhis2/ui';
import { convertValue as convertValueClientToView } from '../../../converters/clientToView';
import { convertValue as convertValueServerToClient } from '../../../converters/serverToClient';
import { dataElementTypes } from '../../../metaData';
import { ManagementStatuses } from '../WidgetManagement.const';

type Props = {|
    generationdate: ?string;
    status: string
|}

export const ManagementGenerationDate = ({ generationdate, status }: Props) => (
    <DataTableCell align={'center'} muted={status !== ManagementStatuses.open}>
        {convertValueClientToView(
            convertValueServerToClient(
                generationdate,
                dataElementTypes.DATE,
            ),
            dataElementTypes.DATE,
        )}
    </DataTableCell>
);
