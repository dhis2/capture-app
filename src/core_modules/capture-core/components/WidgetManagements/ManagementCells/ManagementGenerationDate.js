// @flow
import React from 'react';
import { DataTableCell } from '@dhis2/ui';
import { convertValue as convertValueClientToView } from '../../../converters/clientToView';
import { convertValue as convertValueServerToClient } from '../../../converters/serverToClient';
import { dataElementTypes } from '../../../metaData';

type Props = {|
    generationdate: ?string;
    performed: boolean
|}

export const ManagementGenerationDate = ({ generationdate, performed }: Props) => (
    <DataTableCell width={'10%'} align={'center'} muted={performed}>
        {convertValueClientToView(
            convertValueServerToClient(
                generationdate,
                dataElementTypes.DATE,
            ),
            dataElementTypes.DATE,
        )}
    </DataTableCell>
);
