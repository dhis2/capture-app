import * as React from 'react';

type Props = {
    filterTypeRef: (instance: any) => void,
};

export const withStyleRef = () => (InnerComponent: React.ComponentType<any>) => (props: Props) => (
    <InnerComponent
        innerRef={props.filterTypeRef}
        {...props}
    />
);
