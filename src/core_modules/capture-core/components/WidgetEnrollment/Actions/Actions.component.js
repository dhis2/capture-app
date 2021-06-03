// @flow
import { DropdownButton, FlyoutMenu, MenuDivider, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import React, { type ComponentType } from 'react';
import { Cancel } from './Cancel';
import { Complete } from './Complete';
import { Delete } from './Delete';
import { Followup } from './Followup';
import type { PlainProps } from './actions.types';

const styles = {
    actions: {
        margin: spacersNum.dp4,
    },
};

export const ActionsPlain = ({
    enrollment = {},
    onUpdate,
    onDelete,
    classes,
}: PlainProps) => (
    <>
        <DropdownButton
            dataTest="widget-enrollment-actions-button"
            secondary
            small
            className={classes.actions}
            component={
                <span>
                    <FlyoutMenu dense maxWidth="250px">
                        <Complete
                            enrollment={enrollment}
                            onUpdate={onUpdate}
                        />
                        <Followup
                            enrollment={enrollment}
                            onUpdate={onUpdate}
                        />
                        <MenuDivider />
                        <Cancel
                            enrollment={enrollment}
                            onUpdate={onUpdate}
                        />
                        <Delete
                            enrollment={enrollment}
                            onDelete={onDelete}
                        />
                    </FlyoutMenu>
                </span>
            }
        >
            {i18n.t('Enrollment actions')}
        </DropdownButton>
    </>
);

export const ActionsComponent: ComponentType<$Diff<PlainProps, CssClasses>> =
    withStyles(styles)(ActionsPlain);
