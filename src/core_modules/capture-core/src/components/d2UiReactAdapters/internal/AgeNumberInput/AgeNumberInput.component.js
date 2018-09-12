// @flow
import * as React from 'react';
import TextInput from '../TextInput/TextInput.component';

const AgeNumberInput = (props: any) => {
    const { onBlur, ...passOnProps } = props;
    return (
        <TextInput
            classes={{}}
            onBlur={event => props.onBlur(event.currentTarget.value, event)}
            {...passOnProps}
        />
    );
};

export default AgeNumberInput;
