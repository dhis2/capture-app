// @flow
import * as React from 'react';
import { InputField } from '@dhis2/ui';

type PassOnProps = {
    onBlur: (event: { value: string }) => void,
};
type Props = {
    ...PassOnProps,
};

export const NewTemplateTextField = (props: Props) => {
    const { ...passOnProps } = props;
    const [name, setName] = React.useState('');

    const nameChangeHandler = React.useCallback(({ value }) => {
        if (value.length > 50) {
            setName(value.substring(0, 50));
            return;
        }
        setName(value);
    }, []);

    return (
        <InputField
            {...passOnProps}
            onChange={nameChangeHandler}
            value={name}
        />
    );
};
