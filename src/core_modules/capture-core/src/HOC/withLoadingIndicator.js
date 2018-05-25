// @flow
import * as React from 'react';

// d2-ui
import { LoadingMask } from '@dhis2/d2-ui-core';

type Props = {
    ready: boolean,
};

const withLoadingIndicator = () => (InnerComponent: React.ComponentType<any>) => (props: Props) => {
    const { ready, ...passOnProps } = props;

    if (!ready) {
        return (
            <LoadingMask />
        );
    }

    return (
        <InnerComponent
            {...passOnProps}
        />
    );
};

export default withLoadingIndicator;
