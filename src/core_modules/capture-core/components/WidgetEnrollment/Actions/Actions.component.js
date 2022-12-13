// @flow
import { DropdownButton, FlyoutMenu, MenuDivider, spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import React, { type ComponentType, useState } from 'react';
import { Cancel } from './Cancel';
import { Complete } from './Complete';
import { Delete } from './Delete';
import { Followup } from './Followup';
import { AddNew } from './AddNew';
import { AddLocation } from './AddLocation';
import type { PlainProps } from './actions.types';
import { LoadingMaskForButton } from '../../LoadingMasks';

const styles = {
    actions: {
        margin: `${spacersNum.dp8}px 0 0 0`,
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        margin: `${spacersNum.dp8}px 0 0 0`,
        fontSize: '14px',
        color: colors.grey900,
    },
};

export const ActionsPlain = ({
    enrollment = {},
    tetName,
    canAddNew,
    onUpdate,
    onDelete,
    onAddNew,
    loading,
    onlyEnrollOnce,
    classes,
}: PlainProps) => {
    const [open, setOpen] = useState(false);
    const handleOnUpdate = (arg) => {
        setOpen(prev => !prev);
        onUpdate(arg);
    };
    const handleOnDelete = (arg) => {
        setOpen(prev => !prev);
        onDelete(arg);
    };

    return (
        <>
            <DropdownButton
                dataTest="widget-enrollment-actions-button"
                secondary
                small
                disabled={loading}
                className={classes.actions}
                open={open}
                onClick={() => setOpen(prev => !prev)}
                component={
                    loading ? null : (
                        <FlyoutMenu dense maxWidth="250px">
                            <AddNew
                                onlyEnrollOnce={onlyEnrollOnce}
                                tetName={tetName}
                                canAddNew={canAddNew}
                                onAddNew={onAddNew}
                            />
                            <Complete
                                enrollment={enrollment}
                                onUpdate={handleOnUpdate}
                            />
                            <Followup
                                enrollment={enrollment}
                                onUpdate={handleOnUpdate}
                            />
                            <AddLocation
                                enrollment={enrollment}
                                onAddLocation={() => { console.log('add'); }}
                            />
                            <MenuDivider />
                            <Cancel
                                enrollment={enrollment}
                                onUpdate={handleOnUpdate}
                            />
                            <Delete
                                enrollment={enrollment}
                                onDelete={handleOnDelete}
                            />

                        </FlyoutMenu>
                    )
                }
            >
                {i18n.t('Enrollment actions')}
            </DropdownButton>
            {loading && (
                <div className={classes.loading}>
                    <LoadingMaskForButton />
                    &nbsp;
                    {i18n.t('We are processing your request.')}
                </div>
            )}
        </>
    );
};

export const ActionsComponent: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(ActionsPlain);
