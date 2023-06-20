// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import type { Icon } from '../../../metaData';

const styles = () => ({
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
                    name={icon.name}
                    color={icon.color}
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
