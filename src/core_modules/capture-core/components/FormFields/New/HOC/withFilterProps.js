// @flow
import * as React from 'react';

export const withFilterProps = (filter: (props: Object) => Object) =>
    (InnerComponent: React.ComponentType<any>) => (props: Object) => {
        const passOnProps = filter(props);

        return (
            <InnerComponent
                {...passOnProps}
            />
        );
    }
;
