// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { colors } from '@dhis2/ui';

type Props = {
    label: string,
    onClick: () => void,
    selected: boolean,
};

const styles = {
    button: {
        // Reset button styles
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        font: 'inherit',

        // Custom button styles
        fontSize: '14px',
        padding: '6px 4px',
        color: colors.grey800,
        borderRadius: '3px',

        '&:hover': {
            textDecoration: 'underline',
            color: 'black',
        },
        '&.selected': {
            color: 'black',
        },
    },
};

const BreadcrumbItemPlain = ({ label, onClick, selected, classes }) => (
    <button
        type="button"
        className={cx(classes.button, { selected })}
        onClick={onClick}
    >
        {label}
    </button>
);

export const BreadcrumbItem: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(BreadcrumbItemPlain);
