import * as React from 'react';
import { InputField } from '@dhis2/ui';

type Props = {
    onBlur: (event: { value?: string }) => void;
    className?: string;
    label?: string;
    error?: boolean;
    dataTest?: string;
    initialFocus?: boolean;
    required?: boolean;
    name?: string;
};

export const NewTemplateTextField = (props: Props) => {
    const { onBlur, ...passOnProps } = props;
    const [name, setName] = React.useState('');

    const nameChangeHandler = React.useCallback((payload: { value?: string }) => {
        const { value } = payload;
        if (value && value.length > 50) {
            setName(value.substring(0, 50));
            return;
        }
        setName(value || '');
    }, []);

    const handleBlur = React.useCallback(() => {
        onBlur({ value: name });
    }, [onBlur, name]);

    return (
        <InputField
            {...passOnProps}
            onChange={nameChangeHandler}
            onBlur={handleBlur}
            value={name}
        />
    );
};
