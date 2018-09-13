// @flow
import * as React from 'react';
import TextInput from '../TextInput/TextInput.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';

const AgeNumberInput = (props: any) => (
    <TextInput
        classes={{}}
        value={props.value}
        onChange={props.onChange}
        onBlur={event => props.onBlur(event.currentTarget.value)}
    />
);

export default withInternalChangeHandler()(AgeNumberInput);
