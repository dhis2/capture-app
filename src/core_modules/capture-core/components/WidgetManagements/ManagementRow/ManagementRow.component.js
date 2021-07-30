// @flow
import React, { useState } from 'react';
import { DataTableRow } from '@dhis2/ui';
import { ManagementPriority } from '../ManagementComponents/ManagementPriority';
import type { Management } from '../WidgetManagements.types';
import { ManagementStatus } from '../ManagementComponents/ManagementStatus';
import { ManagementTitle } from '../ManagementComponents/ManagementTitle';
import { ManagementStatuses } from '../WidgetManagement.const';
import { ManagementGenerationDate } from '../ManagementComponents/ManagementGenerationDate';
import { ManagementNotes } from '../ManagementComponents/Notes/ManagementNotes';
import { ManagementActionCell } from '../ManagementComponents/ManagementActionCell';
import { ManagementExpandedContent } from '../ManagementComponents/ManagementExpandedContent/ManagementExpandedContent';

type Props = {|
    management: Management,
    ...CssClasses
|}

export const ManagementRow = ({ management }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const status = ManagementStatuses[management.status.toLowerCase()];

    const onExpandToggle = () => setExpanded(prevState => !prevState);

    return (
        <DataTableRow
            expandableContent={<ManagementExpandedContent management={management} />}
            expanded={expanded}
            onExpandToggle={onExpandToggle}
        >
            <ManagementStatus status={management.status} />
            <ManagementTitle
                displayName={management.displayName}
                status={status}
                reason={management.reason}
            />
            <ManagementGenerationDate
                generationdate={management.generationdate}
                status={status}
            />
            <ManagementPriority
                priority={management.priority}
            />
            <ManagementNotes
                showIcon={!!management?.notes?.length}
            />
            <ManagementActionCell
                status={status}
            />
        </DataTableRow>
    );
};
