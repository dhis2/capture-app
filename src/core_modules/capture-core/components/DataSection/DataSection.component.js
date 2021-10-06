// @flow
import React, { type ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { Props } from './dataSection.type';


const styles = {
    sectionWrapper: {
        border: `1px solid ${colors.grey300}`,
        borderRadius: '3px',
    },
    sectionHeader: {
        backgroundColor: colors.grey300,
        color: '#404B5A',
        fontSize: 12,
        width: 'fit-content',
        padding: 4,
    },
    fieldWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacersNum.dp8,
    },
    fieldLabel: {
        color: colors.grey900,
    },
};

const DataSectionPlain = ({ sectionName, fields, classes, dataTest }: Props) => (
    <div
        data-test={dataTest}
        className={classes.sectionWrapper}
    >
        <div className={classes.sectionHeader}>{sectionName}</div>
        {fields.map(field => (<div className={classes.fieldWrapper} key={field.label}>
            <div className={classes.fieldLabel}>{field.label}</div>
            <div>{field.children}</div>
        </div>))}
    </div>
);


export const DataSection: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(DataSectionPlain);
