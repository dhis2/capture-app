import * as React from 'react';

import { LoadingMaskElementCenter } from '../components/LoadingMasks';

type Props = {
    ready?: boolean | null | undefined;
};

export const withLoadingIndicator =
    (getContainerStylesFn?: ((props: any) => any) | null | undefined, getIndicatorProps?: ((props: any) => any) | null | undefined, readyFn?: (props: any) => boolean | undefined) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: Props) => {
                const { ready, ...other } = props;
                const isReady = readyFn ? readyFn(props) : ready;
                if (!isReady) {
                    const containerStyles = getContainerStylesFn ? getContainerStylesFn(props) : null;
                    const indicatorProps = getIndicatorProps ? getIndicatorProps(props) : null;
                    return (
                        <LoadingMaskElementCenter
                            containerStyle={containerStyles}
                            {...indicatorProps}
                        />
                    );
                }

                return (
                    <InnerComponent
                        {...other}
                    />
                );
            };
