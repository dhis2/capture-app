// @flow
import type { ComponentType } from 'react';
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core';
import { Checkbox } from '@dhis2/ui';

type Props = {
    label: string,
    checked: boolean,
    disabled?: boolean,
    id: string,
    onChange: (status: string) => void,
}

const styles = {
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
    classes,
}) => (
    <button
        type="button"
        onClick={() => onChange(id)}
        disabled={disabled}
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

export const CustomCheckbox: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(CustomCheckboxPlain);
