import * as React from 'react';

const getCleanUpHOC = (InnerComponent: React.ComponentType<any>) =>
    (props: any) => {
        const {
            dataEntryFieldRef,
            firstStageMetaData,
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
