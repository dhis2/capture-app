// @flow
import React, { useState } from 'react';
import { DataTableCell, IconChevronDown16, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import { IconButton } from '../../../../capture-ui';
import { ProvideCommentModal } from './Notes/ProvideCommentModal';
import { ManagementStatuses } from '../WidgetManagement.const';

const styles = {
    Selector: {
        padding: '2px 5px',
        border: '1px solid #CECECEFF',
        backgroundColor: colors.white,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eeeeee',
        },
        '&.selected': {
            backgroundColor: colors.blue100,
            '&:hover': {
                backgroundColor: colors.blue200,
            },
        },
    },
    Chevron: {
        padding: '4px 2px 0px 1px',
        borderRadius: '0 8px 8px 0',
    },
};

type Props = {|
    status: string,
    ...CssClasses,
|}

export const ManagementActionCellPlain = ({ status, classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(false);

    const onSubmit = (values) => {
        console.log(values);
        setOpenStatus(false);
    };

    return (
        <DataTableCell align={'center'}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                    className={cx(classes.Selector, {
                        selected: status === ManagementStatuses.performed,
                    })}
                    style={{ borderRadius: '8px 0 0 8px' }}
                >Yes</button>
                <button
                    className={cx(classes.Selector, {
                        selected: status === ManagementStatuses.notperformed,
                    })}
                    style={{ borderLeft: 'none', borderRight: 'none' }}
                    onClick={() => setOpenStatus(true)}
                >No</button>
                <div className={cx(classes.Selector, classes.Chevron)}>
                    <IconButton onClick={() => {}}>
                        <IconChevronDown16 />
                    </IconButton>
                </div>
            </div>
            {openStatus && <ProvideCommentModal
                setOpenStatus={setOpenStatus}
                submitFunc={onSubmit}
            />}
        </DataTableCell>
    );
};

export const ManagementActionCell = withStyles(styles)(ManagementActionCellPlain);
