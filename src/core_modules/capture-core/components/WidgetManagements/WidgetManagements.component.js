// @flow
import React, { useCallback, useState } from 'react';
import { withStyles } from '@material-ui/core';
import {
    spacersNum,
    DataTable,
    TableHead,
    DataTableRow,
    DataTableColumnHeader,
} from '@dhis2/ui';
import { Widget } from '../Widget';
import { ManagementRow } from './ManagementRow';

const styles = {
    container: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
    ManagementsActions: {
        padding: '8px 12px 2px 12px',
    },
    notesBox: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    PriorityCell: {
        display: 'flex',
        justifyContent: 'center',
    },
};

const managements = [
    {
        id: 'asdoij',
        status: 'Open',
        displayName: 'Make referral to high risk clinic',
        reason: 'Patient shows signs of high diastolic blood pressure',
        performed: false,
        generationdate: '2021-07-03T23:47:14.517',
        priority: 'Critical',
        notes: [{ id: 'odmt1ehd0', comment: 'Can you double check the blood levels?' }],
    },
    {
        id: 'asdkjas',
        status: 'Performed',
        displayName: 'Prescribe folic acid for three months',
        reason: 'Patient shows signs of high diastolic blood pressure',
        performed: true,
        generationdate: '2021-07-03T23:47:14.517',
        priority: 'Low',
        notes: [{ id: 'odmt1ehd0', comment: 'Can you double check the blood levels?' }],
    },
    {
        id: 'safpj',
        status: 'Suggested',
        displayName: 'Referral to clinic for blood test on folic acid levels after 3 months',
        reason: 'It is suggested that an explanation is provided when the Apgar score is below 4',
        performed: false,
        generationdate: '2021-07-03T23:47:14.517',
        priority: 'Moderate',
        notes: [{ id: 'odmt1ehd0', comment: 'Can you double check the blood levels?' }],
    },

];

const WidgetManagementsComponentPlain = ({ classes }) => {
    const [openState, setOpenState] = useState(true);

    return (
        <Widget
            header={'Managements'}
            open={openState}
            onOpen={useCallback(() => setOpenState(true), [setOpenState])}
            onClose={useCallback(() => setOpenState(false), [setOpenState])}
        >
            <div className={classes.container}>
                <DataTable>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader />
                            <DataTableColumnHeader>
                                Status
                            </DataTableColumnHeader>
                            <DataTableColumnHeader >
                                Management
                            </DataTableColumnHeader>
                            <DataTableColumnHeader align={'center'}>
                                Performed
                            </DataTableColumnHeader>
                            <DataTableColumnHeader align={'center'}>
                                Generation date
                            </DataTableColumnHeader>
                            <DataTableColumnHeader >
                                Priority
                            </DataTableColumnHeader>
                            <DataTableColumnHeader align={'center'}>
                                Notes
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                Actions
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    {managements.map(management => (
                        <ManagementRow
                            management={management}
                            key={management.id}
                        />
                    ))}
                </DataTable>
            </div>
        </Widget>
    );
};

export const WidgetManagementsComponent = withStyles(styles)(WidgetManagementsComponentPlain);
