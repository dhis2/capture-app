// @flow
import React from 'react';
import { DataTableCell, Tag } from '@dhis2/ui';

type Props = {|
    priority: string
|}

export const ManagementPriority = ({ priority }: Props) => {
    if (!priority) {
        return <DataTableCell />;
    }

    const lowerCasePriority = priority.toLowerCase();

    const priorities = Object.freeze({
        critical: 'Critical',
        moderate: 'Moderate',
        low: 'Low',
    });

    return (
        <DataTableCell align={'center'}>
            <Tag
                negative={priorities[lowerCasePriority] === priorities.critical}
                neutral={priorities[lowerCasePriority] === priorities.low}
            >
                {priorities[lowerCasePriority]}
            </Tag>
        </DataTableCell>
    );
};
