// @flow
import React from 'react';
import { SingleSelectField as SingleSelectFieldUI, SingleSelectOption } from '@dhis2/ui';
import { withFocusHandler } from './withFocusHandler';

type Props = {
    value: ?string,
    onBlur?: ?(value: any) => void,
    onFocus?: ?(value: any) => void,
    options: Array<{ value: any, label: string }>,
    disabled?: ?boolean,
    required?: ?boolean,
    placeholder?: ?string,
    filterable?: ?boolean,
    clearable?: ?boolean,
    dataTest?: ?string,
};


const SingleSelectFieldComponentPlain = (props: Props) => {
    const {
        value,
        onBlur,
        onFocus,
        options,
        disabled,
        required,
        placeholder,
        filterable = true,
        clearable = true,
        dataTest,
    } = props;
    const selectedValue: ?string = value ?? '';

    const handleBlur = () => {
        onBlur?.(selectedValue || null);
    };

    const handleSelect = ({ selected }) => {
        onBlur?.(selected);
    };
    return (
        <SingleSelectFieldUI
            selected={selectedValue}
            onChange={handleSelect}
            onFocus={onFocus}
            onKeyDown={handleBlur}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            filterable={filterable}
            clearable={clearable}
            dataTest={dataTest}
        >
            {options.map(option => (
                <SingleSelectOption
                    key={option.value}
                    label={option.label}
                    value={option.value}
                />
            ))}
        </SingleSelectFieldUI>
    );
};

export const SingleSelectField = withFocusHandler()(SingleSelectFieldComponentPlain);
