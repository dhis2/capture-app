import * as React from 'react';

export const withFilterProps = (filter: (props: any) => any) =>
    (InnerComponent: React.ComponentType<any>) => (props: any) => {
        const passOnProps = filter(props);

        return (
            <InnerComponent
                {...passOnProps}
            />
        );
    }
;
