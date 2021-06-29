// @flow
import React, { type ComponentType } from 'react';

import { IconInfo16, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { Props, PlainProps } from './SectionDescriptionBox.types';

const styles = {
    descriptionBox: {
        display: 'flex',
        marginBottom: 8,
        marginRight: 15,
        color: colors.grey700,
    },
    icon: {
        minWidth: 16,
        marginLeft: 10,
        marginRight: 5,
        marginTop: 1,
    },
    description: {
        fontSize: 13,
        lineHeight: '17px',
    },
};

const SectionDescriptionBoxPlain = (props: PlainProps) => {
    const { classes, description } = props;

    return (
        <div className={classes.descriptionBox}>
            <div className={classes.icon}>
                <IconInfo16 />
            </div>
            <div className={classes.description}>
                {description}
            </div>
        </div>
    );
};

export const SectionDescriptionBox: ComponentType<Props> = withStyles(styles)(SectionDescriptionBoxPlain);
