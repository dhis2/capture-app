// @flow
import * as React from 'react';

type Props = {
    filterTypeRef: (instance: any) => void,
};

export default () => (InnerComponent: React.ComponentType<any>) => (props: Props) => {
    const { filterTypeRef, ...passOnProps } = props;
    return (
        <InnerComponent
            ref={filterTypeRef}
            {...passOnProps}
        />
    );
};
