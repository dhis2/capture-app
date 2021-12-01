// @flow
import { Button as D2Button } from '@dhis2/ui';
import * as React from 'react';

type Props = {};

export const Button = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <D2Button
            {...passOnProps}
        />
    );
};
