// @flow
import React from 'react';
import { compose } from 'redux';
import { SingleSelectField as SingleSelectFieldUI, SingleSelectOption } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { withFocusHandler } from './withFocusHandler';

const styles = theme => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
});

type Props = {
    value: ?string,
    onChange?: any,
    onBlur?: ?(value: any) => void,
    options: Array<{value: any, label: string}>,
    disabled?: ?boolean,
    required?: ?boolean,
    placeholder?: ?string,
    filterable?: ?boolean,
    clearable?: ?boolean,
    dataTest?: ?string,
};

const SingleSelectComponent = compose(
    withStyles(styles),
    withFocusHandler()
)(SingleSelectFieldUI);

export const SingleSelectField = (props: Props) => {
    const {
        value,
        onBlur,
        onChange,
        options,
        disabled,
        required,
        placeholder,
        filterable = true,
        clearable = true,
        dataTest = 'single-select-input',
        ...passOnProps
    } = props;

    const handleSelect = ({ selected }) => {
        onBlur?.(selected);
    };


    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <SingleSelectComponent
            selected={value || ''}
            onChange={handleSelect}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            filterable={filterable}
            clearable={clearable}
            dataTest={dataTest}
            {...passOnProps}
        >
            {options?.map(option => (
                <SingleSelectOption
                    key={option.value}
                    label={option.label}
                    value={option.value}
                />
            ))}
        </SingleSelectComponent>
    );
};
