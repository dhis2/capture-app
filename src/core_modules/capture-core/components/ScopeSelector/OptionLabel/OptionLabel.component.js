// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import type { Icon } from '../../../metaData';

const styles = () => ({
    selectBarMenu: {
        maxHeight: '80vh',
        overflow: 'auto',
        paddingBottom: `${spacers.dp4}`,
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: 5,
    },
    label: {
        display: 'flex',
        alignItems: 'center',
    },
});

type Props = {
    icon?: Icon,
    label: string,
    ...CssClasses,
};

export const OptionLabelPlain = ({ icon, label, classes }: Props) => (
    <div className={classes.label}>
        {icon ? (
            <div className={classes.icon}>
                <NonBundledDhis2Icon
                    name={icon.name || 'clinical_fe_outline'}
                    color={icon.color || '#e0e0e0'}
                    alternativeText={icon.name}
                    width={22}
                    height={22}
                    cornerRadius={2}
                />
            </div>
        ) : null}
        {label}
    </div>
);

export const OptionLabel = withStyles(styles)(OptionLabelPlain);
