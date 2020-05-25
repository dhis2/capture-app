// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { LoadingMaskForPage } from '../components/LoadingMasks';
import LoadingMaskElementCenter from '../components/LoadingMasks/LoadingMaskElementCenter.component';

type Props = {
    ready: boolean,
    InnerComponent: React.ComponentType<any>
};

const getLoadingIndicator = (getContainerStylesFn?: ?(props: any) => Object, fullPage?: ?boolean) => (props: Props) => {
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

export default (
    isReadyFn: (state: ReduxState, props: any) => boolean,
    getContainerStylesFn?: ?(props: any) => Object,
    fullPage?: ?boolean,
) =>
    (InnerComponent: React.ComponentType<any>) => {
        const mapStateToProps = (state: ReduxState, props: any) => ({
            ready: isReadyFn(state, props),
        });

        const mergeProps = (stateProps, dispatchProps, ownProps) =>
            Object.assign({}, ownProps, stateProps, dispatchProps, {
                InnerComponent,
            });

        // $FlowSuppress
        const LoadingIndicatorContainer = connect(mapStateToProps, null, mergeProps)(getLoadingIndicator(getContainerStylesFn, fullPage));
        return LoadingIndicatorContainer;
    };
