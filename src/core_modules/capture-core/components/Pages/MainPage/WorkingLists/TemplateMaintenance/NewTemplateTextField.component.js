// @flow
import * as React from 'react';
import { InputField } from '@dhis2/ui-core';

type PassOnProps = {
    onBlur: (event: SyntheticEvent<HTMLInputElement>) => void,
};
type Props = {
    ...PassOnProps,
};

const NewTemplateTextField = (props: Props) => {
    const { ...passOnProps } = props;
    const [name, setName] = React.useState('');

    const nameChangeHandler = React.useCallback((event: SyntheticEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        if (value.length > 50) {
            setName(value.substring(0, 50));
            return;
        }
        setName(event.currentTarget.value);
    }, []);

    return (
        <InputField
            {...passOnProps}
            onChange={nameChangeHandler}
            value={name}
        />
    );
};

export default NewTemplateTextField;
