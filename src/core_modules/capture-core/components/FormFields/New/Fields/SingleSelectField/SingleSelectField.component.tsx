import React from 'react';
import { SimpleSingleSelect } from '@dhis2-ui/select';

type Props = {
    id: string;
    value?: string;
    onBlur?: (value: any) => void;
    onFocus?: (value: any) => void;
    onChange?: (value: any) => void;
    options: Array<{ value: any; label: string }>;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    filterable?: boolean;
    clearable?: boolean;
};

const SingleSelectFieldComponentPlain = (props: Props) => {
    const {
        id,
        value,
        onBlur,
        onFocus,
        options,
        disabled,
        required,
        placeholder,
        filterable = true,
        clearable = true,
    } = props;

    console.log(props);
    
    const simpleOptions = options.map(option => ({
        label: option.label,
        value: option.value,
    }));

    const onChange = (value: string) => {
        props.onChange?.(value);
    };
    

    return (
        <SimpleSingleSelect
            idPrefix={id}
            options={simpleOptions}
            value={value ?? ''}
            onChange={onChange}
        />
    );
};

export const SingleSelectField = (SingleSelectFieldComponentPlain);
