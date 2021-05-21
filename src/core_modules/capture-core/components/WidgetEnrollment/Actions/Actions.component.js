// @flow
import { DropdownButton, FlyoutMenu, MenuDivider, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import React, { type ComponentType } from 'react';
import { Cancel } from './Cancel';
import { Complete } from './Complete';
import { Delete } from './Delete';
import { Followup } from './Followup';

const styles = {
    actions: {
        margin: spacersNum.dp4,
    },
};

type Props = {|
    enrollment: Object,
    updateAction: (arg: Object) => void,
    deleteAction: (arg: Object) => void,
    ...CssClasses,
|};

export const ActionsPlain = ({
    enrollment = {},
    updateAction,
    deleteAction,
    classes,
}: Props) => (
    <>
        <DropdownButton
            secondary
            small
            className={classes.actions}
            dataTest="widget-enrollment-actions-button"
            component={
                <span>
                    <FlyoutMenu dense maxWidth="250px">
                        <Complete
                            enrollment={enrollment}
                            updateAction={updateAction}
                        />
                        <Followup
                            enrollment={enrollment}
                            updateAction={updateAction}
                        />
                        <MenuDivider />
                        <Cancel
                            enrollment={enrollment}
                            updateAction={updateAction}
                        />
                        <Delete
                            enrollment={enrollment}
                            deleteAction={deleteAction}
                        />
                    </FlyoutMenu>
                </span>
            }
        >
            {i18n.t('Enrollment actions')}
        </DropdownButton>
    </>
);

export const ActionsComponent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(ActionsPlain);
