// @flow
import * as React from 'react';

import LoadingMaskElementCenter from '../components/LoadingMasks/LoadingMaskElementCenter.component';
import LoadingMaskForPage from '../components/LoadingMasks/LoadingMaskForPage.component';

type Props = {
    ready: boolean,
};

const withLoadingIndicator =
    (getContainerStylesFn?: ?(props: any) => Object, fullPage?: ?boolean, readyFn?: (props: any) => boolean) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: Props) => {
                const { ready, ...other } = props;
                const isReady = readyFn ? readyFn(props) : ready;
                if (!isReady) {
                    if (fullPage) {
                        return (
                            <LoadingMaskForPage />
                        );
                    }

                    const containerStyles = getContainerStylesFn ? getContainerStylesFn(props) : null;
                    return (
                        <LoadingMaskElementCenter
                            containerStyle={containerStyles}
                        />
                    );
                }

                return (
                    <InnerComponent
                        {...other}
                    />
                );
            };

export default withLoadingIndicator;
