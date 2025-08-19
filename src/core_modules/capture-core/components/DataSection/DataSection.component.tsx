import React, { type ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';

import type { DataSectionProps } from './DataSection.types';

const styles = (theme: any) => ({
    sectionWrapper: {
        border: `1px solid ${colors.grey300}`,
        borderRadius: '3px',
        marginBottom: spacersNum.dp16,
        maxWidth: theme.typography.pxToRem(892),
    },
    sectionHeader: {
        color: colors.grey900,
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: colors.grey300,
        padding: '4px 8px',
        marginBottom: '8px',
        width: 'fit-content',
    },
});

type Props = DataSectionProps & WithStyles<typeof styles>;

const DataSectionPlain = ({ sectionName, children, classes, dataTest }: Props) => (
    <div
        data-test={dataTest}
        className={classes.sectionWrapper}
    >
        <div className={classes.sectionHeader}>{sectionName}</div>
        {children}
    </div>
);

export const DataSection =
    withStyles(styles)(DataSectionPlain) as ComponentType<DataSectionProps>;
