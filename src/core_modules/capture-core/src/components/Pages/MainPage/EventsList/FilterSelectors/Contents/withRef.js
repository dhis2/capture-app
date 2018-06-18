// @flow
import * as React from 'react';

type Props = {
    filterTypeRef: (instance: any) => void,
};

export default () => (InnerComponent: React.ComponentType<any>) => (props: Props) => (
    <InnerComponent
        ref={props.filterTypeRef}
        {...props}
    />
);
