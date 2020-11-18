// @flow
import * as React from 'react';

type Props = {
    filterTypeRef: (instance: any) => void,
};

export default () => (InnerComponent: React.ComponentType<any>) => (props: Props) => {
    const { filterTypeRef, ...passOnProps } = props;
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <InnerComponent
            ref={filterTypeRef}
            {...passOnProps}
        />
    );
};
