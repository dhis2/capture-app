// @flow
import * as React from 'react';
import { LoadingMaskForPage } from '../components/LoadingMasks';

type Props = {
    ready: boolean,
};

export const withLoadingIndicator =
    (readyFn?: (props: any) => boolean) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: Props) => {
                const { ready, ...other } = props;
                const isReady = readyFn ? readyFn(props) : ready;
                if (!isReady) {
                    return (
                        <LoadingMaskForPage />
                    );
                }

                return (
                    <InnerComponent
                        {...other}
                    />
                );
            };
