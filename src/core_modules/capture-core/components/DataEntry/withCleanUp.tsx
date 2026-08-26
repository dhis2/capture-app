import * as React from 'react';

const getCleanUpHOC = (InnerComponent: React.ComponentType<any>) =>
    (props: Record<string, any>) => {
        const {
            onSearchGroupResultCountRetrieved,
            onSearchGroupResultCountRetrievalFailed,
            ...passOnProps
        } = props;

        return (
            <InnerComponent
                {...passOnProps}
            />
        );
    };

export const withCleanUp = () =>
    (InnerComponent: React.ComponentType<any>) =>
        getCleanUpHOC(InnerComponent);
