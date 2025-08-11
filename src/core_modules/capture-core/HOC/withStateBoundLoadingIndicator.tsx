import * as React from 'react';
import { connect } from 'react-redux';

import { LoadingMaskForPage, LoadingMaskElementCenter } from '../components/LoadingMasks';

type Props = {
    ready: boolean;
    InnerComponent: React.ComponentType<any>;
};

const getLoadingIndicator = (getContainerStylesFn?: ((props: any) => any) | null | undefined, fullPage?: boolean | null | undefined) => (props: Props) => {
    const { ready, InnerComponent, ...other } = props;

    if (!ready) {
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

export const withStateBoundLoadingIndicator = (
    isReadyFn: (state: any, props: any) => boolean,
    getContainerStylesFn?: ((props: any) => any) | null | undefined,
    fullPage?: boolean | null | undefined,
) =>
    (InnerComponent: React.ComponentType<any>) => {
        const mapStateToProps = (state: any, props: any) => ({
            ready: isReadyFn(state, props),
        });

        const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) =>
            Object.assign({}, ownProps, stateProps, dispatchProps, {
                InnerComponent,
            });

        const LoadingIndicatorContainer = connect(mapStateToProps, null, mergeProps)(getLoadingIndicator(getContainerStylesFn, fullPage));
        return LoadingIndicatorContainer;
    };
