// @flow
import * as React from 'react';
import { Button as D2Button } from '@dhis2/ui';

type Props = {};

export const Button = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <D2Button
            {...passOnProps}
        />
    );
};
