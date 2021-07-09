// @flow
import React, { useCallback, useState } from 'react';
import { withStyles } from '@material-ui/core';
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
    MenuItem,
    IconMessages16,
    IconMore24,
    Tag,
} from '@dhis2/ui';
import { IconButton } from 'capture-ui';
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
    ModerateTag: {
        backgroundColor: '#bb986f',
        background: '#cecece',
        color: 'red',
    },
    Selector: {
        padding: '5px 8px',
        border: '1px solid #CECECEFF',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eeeeee',
        },
    },
};


const WidgetManagementsComponentPlain = ({ classes }) => {
    const [openState, setOpenState] = useState(true);

    const ManagementsActions = () => (
        <span>
            <FlyoutMenu dense>
                <MenuItem label={'Activate'} />
                <MenuItem label={'Disable'} />
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
                            <DataTableColumnHeader>
                                Status
                            </DataTableColumnHeader>
                            <DataTableColumnHeader >
                                Management
                            </DataTableColumnHeader>
                            <DataTableColumnHeader>
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
                    <TableBody>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell>
                                <Tag neutral>
                                    Open
                                </Tag>
                            </DataTableCell>
                            <DataTableCell>
                                <p style={{ margin: '3px 0' }}>Make referral to high risk clinic</p>
                                <span style={{ color: '#9e9a9a', marginBottom: 3 }}>Patient shows signs of high diastolic blood pressure</span>
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ display: 'flex' }}>
                                    <div className={classes.Selector} style={{ borderRadius: '8px 0 0 8px' }}>Yes</div>
                                    <div className={classes.Selector} style={{ borderRadius: '0 8px 8px 0' }}>No</div>
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'5%'} align={'center'}>
                                29/06/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <Tag negative>
                                    Critical
                                </Tag>
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                                    <IconMessages16 />
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'5%'} align={'center'}>
                                <IconButton onClick={() => {}} style={{ transform: 'rotate(90deg)' }}>
                                    <IconMore24 />
                                </IconButton>
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell>
                                <Tag positive>
                                    Performed
                                </Tag>
                            </DataTableCell>
                            <DataTableCell muted>
                                Prescribe folic acid for three months
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ display: 'flex' }}>
                                    <div className={classes.Selector} style={{ borderRadius: '8px 0 0 8px', backgroundColor: '#ebf5ea' }}>Yes</div>
                                    <div className={classes.Selector} style={{ borderRadius: '0 8px 8px 0' }}>No</div>
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'5%'} align={'center'} muted>
                                06/07/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <Tag className={classes.ModerateTag}>
                                    Moderate
                                </Tag>
                            </DataTableCell>
                            <DataTableCell width={'5%'}>

                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div className={classes.notesBox}>
                                    <DropdownButton
                                        secondary
                                        small
                                        component={<ManagementsActions />}
                                    >
                                        Actions
                                    </DropdownButton>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell>
                                <Tag neutral>
                                    Suggested
                                </Tag>
                            </DataTableCell>
                            <DataTableCell>
                                Referral to clinic for blood test on folic acid levels after 3 months
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ display: 'flex' }}>
                                    <div className={classes.Selector} style={{ borderRadius: '8px 0 0 8px' }}>Yes</div>
                                    <div className={classes.Selector} style={{ borderRadius: '0 8px 8px 0' }}>No</div>
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'8%'} align={'center'}>
                                06/07/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <Tag neutral>
                                    Low
                                </Tag>
                            </DataTableCell>
                            <DataTableCell width={'5%'}>

                            </DataTableCell>
                            <DataTableCell width={'5%'} align={'center'}>
                                <IconButton onClick={() => {}} style={{ transform: 'rotate(90deg)' }}>
                                    <IconMore24 />
                                </IconButton>
                            </DataTableCell>
                        </DataTableRow>
                        <DataTableRow
                            expandableContent={<div>Test</div>}
                        >
                            <DataTableCell>
                                <Tag negative>
                                    Not performed
                                </Tag>
                            </DataTableCell>
                            <DataTableCell>
                                <p style={{ margin: '3px 0' }}>Provide an explanation</p>
                                <span style={{ color: '#9e9a9a', marginBottom: 3 }}>It is suggested that an explanation is provided when the Apgar score is below 4</span>
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <div style={{ display: 'flex' }}>
                                    <div className={classes.Selector} style={{ borderRadius: '8px 0 0 8px' }}>Yes</div>
                                    <div className={classes.Selector} style={{ borderRadius: '0 8px 8px 0', backgroundColor: '#ffe1e3' }}>No</div>
                                </div>
                            </DataTableCell>
                            <DataTableCell width={'8%'} align={'center'}>
                                06/07/2021
                            </DataTableCell>
                            <DataTableCell width={'5%'}>
                                <Tag neutral>
                                    Low
                                </Tag>
                            </DataTableCell>
                            <DataTableCell width={'5%'}>

                            </DataTableCell>
                            <DataTableCell width={'5%'} align={'center'}>
                                <IconButton onClick={() => {}} style={{ transform: 'rotate(90deg)' }}>
                                    <IconMore24 />
                                </IconButton>
                            </DataTableCell>
                        </DataTableRow>
                    </TableBody>
                </DataTable>
            </div>
        </Widget>
    );
};

export const WidgetManagementsComponent = withStyles(styles)(WidgetManagementsComponentPlain);
