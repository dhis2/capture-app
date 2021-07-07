// @flow
import React, { useCallback, useState } from 'react';
import { MenuItem, withStyles } from '@material-ui/core';
import {
    spacersNum,
    DataTable,
    TableHead,
    DataTableRow,
    DataTableColumnHeader,
    TableBody,
    DataTableCell,
    DropdownButton,
    FlyoutMenu,
    IconMessages16,
    Tag,
} from '@dhis2/ui';
import { Widget } from '../Widget';

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


const WidgetManagementsComponentPlain = ({ classes }) => {
    const [openState, setOpenState] = useState(true);

    const ManagementsActions = () => (
        <span>
            <FlyoutMenu>
                <MenuItem label={'Activate'} onClick={() => {}} />
                <MenuItem label={'Disable'} onClick={() => {}} />
            </FlyoutMenu>
        </span>
    );

    return (
        <Widget
            header={'Managements'}
            open={openState}
            onOpen={useCallback(() => setOpenState(true), [setOpenState])}
            onClose={useCallback(() => setOpenState(false), [setOpenState])}
        >
            <div className={classes.container}>
                <DataTable layout={'flex'}>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader />
                            <DataTableColumnHeader >
                                Priority
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                Display name
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                Generation date
                            </DataTableColumnHeader>
                            <DataTableColumnHeader align={'center'}>
                                Notes
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
                                Status
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell width={'5%'}>
                                <Tag negative>
                                    Critical
                                </Tag>
                            </DataTableCell>
                            <DataTableCell>
                                <div>
                                    <p style={{ margin: '3px 0' }}>Make referral to high risk clinic</p>
                                    <span style={{ color: '#9e9a9a', marginBottom: 3 }}>Patient shows signs of high diastolic blood pressure</span>
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'15%'}>
                                29/06/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                                    <IconMessages16 />
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'10%'}>
                                <div className={classes.notesBox}>
                                    <DropdownButton
                                        secondary
                                        small
                                        component={<ManagementsActions />}
                                    >
                                        Active
                                    </DropdownButton>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell width={'5%'}>
                                <Tag positive>
                                    Completed
                                </Tag>
                            </DataTableCell>
                            <DataTableCell muted>
                                Prescribe folic acid for three months
                            </DataTableCell>
                            <DataTableCell width={'15%'} muted>
                                06/07/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                                    <IconMessages16 />
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'10%'}>
                                <div className={classes.notesBox}>
                                    <DropdownButton
                                        secondary
                                        small
                                        component={<ManagementsActions />}
                                        disabled
                                    >
                                        Completed
                                    </DropdownButton>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell width={'5%'}>
                                <Tag neutral>
                                    Suggested
                                </Tag>
                            </DataTableCell>
                            <DataTableCell>
                                Referral to clinic for blood test on folic acid levels after 3 months
                            </DataTableCell>
                            <DataTableCell width={'15%'}>
                                06/07/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                                    <IconMessages16 />
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'10%'}>
                                <div className={classes.notesBox}>
                                    <DropdownButton
                                        secondary
                                        small
                                        component={<ManagementsActions />}
                                    >
                                        Active
                                    </DropdownButton>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    </TableBody>
                </DataTable>
            </div>
        </Widget>
    );
};

export const WidgetManagementsComponent = withStyles(styles)(WidgetManagementsComponentPlain);
