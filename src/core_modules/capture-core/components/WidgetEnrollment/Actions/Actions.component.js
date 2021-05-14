// @flow
import {
    DropdownButton,
    FlyoutMenu,
    IconArrowRight16,
    IconMore16,
    MenuDivider,
    MenuItem,
    spacersNum,
} from '@dhis2/ui';
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
    mutate: (arg: Object) => void,
    ...CssClasses,
|};

export const ActionsPlain = ({ enrollment = {}, mutate, classes }: Props) => (
    <>
        <DropdownButton
            secondary
            small
            className={classes.actions}
            dataTest="widget-enrollment-actions-button"
            component={
                <span>
                    <FlyoutMenu dense maxWidth="250px">
                        <Complete enrollment={enrollment} mutate={mutate} />
                        <Followup enrollment={enrollment} mutate={mutate} />

                        <MenuItem
                            icon={<IconArrowRight16 />}
                            label={i18n.t('Transfer...')}
                        />
                        <MenuItem
                            icon={<IconMore16 />}
                            label={i18n.t('Show 4 previous enrollments')}
                        />

                        <MenuDivider />
                        <Cancel enrollment={enrollment} mutate={mutate} />
                        <Delete enrollment={enrollment} mutate={mutate} />
                    </FlyoutMenu>
                </span>
            }
        >
            {i18n.t('Enrollment actions')}
        </DropdownButton>
    </>
);

export const ActionsComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(ActionsPlain);
