import React from 'react';
import cx from 'classnames';
import { withStyles, type WithStyles } from '@material-ui/core';
import { Checkbox } from '@dhis2/ui';
import type { PlainProps } from './CustomCheckbox.types';

const styles: Readonly<any> = {
    checkboxButton: {
        // Reset default browser styles
        appearance: 'none',
        background: 'none',
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',

        // Custom styles
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '16px',
        border: '2px solid #E2E8F0',
        borderRadius: '6px',
        marginBottom: '8px',
        transition: 'all 0.2s',
        textAlign: 'left',
        backgroundColor: 'white',
        '&:hover': {
            backgroundColor: '#F7FAFC',
        },
        '&.checked': {
            borderColor: '#38A169',
        },
        '&.disabled': {
            borderColor: '#E2E8F0',
            backgroundColor: '#F7FAFC',
            cursor: 'not-allowed',
        },
    },
};

const CustomCheckboxPlain = ({
    checked,
    id,
    onChange,
    label,
    disabled,
    dataTest,
    classes,
}: PlainProps & WithStyles<typeof styles>) => (
    <button
        type="button"
        onClick={() => onChange(id)}
        disabled={disabled}
        data-test={dataTest}
        className={cx(classes.checkboxButton, {
            checked,
            disabled,
        })}
        aria-checked={checked}
        role="checkbox"
    >
        <Checkbox
            checked={checked}
            disabled={disabled}
        />
        {label}
    </button>
);

export const CustomCheckbox = withStyles(styles)(CustomCheckboxPlain);
