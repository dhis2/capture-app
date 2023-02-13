// @flow
import React, { type ComponentType } from 'react';
import { colors, spacersNum } from '@dhis2/ui';
import cx from 'classnames';
import { withStyles } from '@material-ui/core';
import type { Props } from './dataSection.type';


const styles = (theme: Theme) => ({
    sectionWrapper: {
        border: `1px solid ${colors.grey300}`,
        borderRadius: '3px',
        marginBottom: spacersNum.dp16,
        '&.error': {
            backgroundColor: theme.palette.error.lighter,
        },
        '&.warning': {
            backgroundColor: theme.palette.warning.lighter,
        },
    },
    sectionHeader: {
        backgroundColor: colors.grey300,
        color: '#404B5A',
        fontSize: 12,
        width: 'fit-content',
        padding: 4,
    },
    errorMessage: {
        color: theme.palette.error.main,
        fontSize: theme.typography.pxToRem(14),
        padding: '10px 8px',
    },
    warningMessage: {
        color: theme.palette.warning.dark,
        fontSize: theme.typography.pxToRem(14),
    },
});

const DataSectionPlain = ({ sectionName, error, errorMessage, children, warning, classes, dataTest }: Props) => (
    <div
        data-test={dataTest}
        className={cx(classes.sectionWrapper, { error, warning })}
    >
        <div className={classes.sectionHeader}>{sectionName}</div>
        {children}
        {error && <div className={classes.errorMessage}>{errorMessage}</div>}
    </div>
);


export const DataSection: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(DataSectionPlain);
