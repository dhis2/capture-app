// @flow
import * as React from 'react';
import D2AgeField from '../../../../d2UiReactAdapters/AgeField/D2AgeField.component';

const AgeField = (props: any) => {
    const { onBlur, ...passOnProps } = props;
    return (
        <D2AgeField
            classes={{}}
            onAgeChanged={value => props.onBlur(value)}
            {...passOnProps}
        />
    );
};

export default AgeField;
