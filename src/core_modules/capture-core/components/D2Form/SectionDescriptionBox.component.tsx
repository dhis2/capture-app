import React from 'react';

import { IconInfo16, colors } from '@dhis2/ui';
import { withStyles } from 'capture-core-utils/styles';
import type { WithStyles } from 'capture-core-utils/styles';
import type { Props } from './SectionDescriptionBox.types';

const styles = {
    descriptionBox: {
        display: 'flex',
        marginBottom: 8,
        marginInlineEnd: 15,
        color: colors.grey700,
    },
    icon: {
        minWidth: 16,
        marginInlineStart: 10,
        marginInlineEnd: 5,
        marginTop: 1,
    },
    description: {
        fontSize: 13,
        lineHeight: '17px',
    },
};

const SectionDescriptionBoxPlain = (props: Props & WithStyles<typeof styles>) => {
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

export const SectionDescriptionBox = withStyles(styles)(SectionDescriptionBoxPlain);
