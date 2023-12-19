// @flow
import React, { type ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { Props } from './dataSection.type';


const styles = theme => ({
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

const DataSectionPlain = ({ sectionName, children, classes, dataTest }: Props) => (
    <div
        data-test={dataTest}
        className={classes.sectionWrapper}
    >
        <div className={classes.sectionHeader}>{sectionName}</div>
        {children}
    </div>
);


export const DataSection: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(DataSectionPlain);
