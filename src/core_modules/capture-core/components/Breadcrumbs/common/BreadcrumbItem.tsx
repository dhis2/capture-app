import React, { ComponentType } from 'react';
import { withStyles, WithStyles, composeCssArray } from 'capture-core-utils/styles';
import { colors } from '@dhis2/ui';

type OwnProps = {
    label: string,
    onClick: () => void,
    selected: boolean,
    dataTest: string,
};

type Props = OwnProps & WithStyles<typeof styles>;

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
    },
    selected: {
        color: 'black',
    },
} as const;

const BreadcrumbItemPlain = ({ label, onClick, selected, dataTest, classes }: Props) => (
    <button
        type="button"
        css={composeCssArray(classes, { button: true, selected })}
        onClick={onClick}
        data-test={dataTest}
    >
        {label}
    </button>
);

export const BreadcrumbItem = withStyles(styles)(BreadcrumbItemPlain) as ComponentType<OwnProps>;
