// @flow
import * as React from 'react';

type Props = {

};

export const withTransformPropName =
    (fromToPropNames: Array<string>) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: Props) => {
                const [fromName, toName] = fromToPropNames;
                const transformedProp = {
                    [toName]: props[fromName],
                };

                const passOnProps = {
                    ...props,
                };
                passOnProps[fromName] && delete passOnProps[fromName];

                return (
                    <InnerComponent
                        {...passOnProps}
                        {...transformedProp}
                    />
                );
            };
