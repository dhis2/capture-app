// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// d2-ui
import { LoadingMask } from '@dhis2/d2-ui-core';

type Props = {
    ready: boolean,
    InnerComponent: React.ComponentType<any>
};

const LoadingIndicator = (props: Props) => {
    const { ready, InnerComponent, ...other } = props;

    if (!ready) {
        return (
            <LoadingMask />
        );
    }

    return (
        <InnerComponent
            {...other}
        />
    );
};

export default (isReadyFn: (state: ReduxState, props: any) => boolean) =>
    (InnerComponent: React.ComponentType<any>) => {
        const mapStateToProps = (state: ReduxState, props: any) => ({
            ready: isReadyFn(state, props),
        });

        const mergeProps = (stateProps, dispatchProps, ownProps) =>
            Object.assign({}, ownProps, stateProps, dispatchProps, {
                InnerComponent,
            });

        // $FlowSuppress
        const LoadingIndicatorContainer = connect(mapStateToProps, null, mergeProps)(LoadingIndicator);
        return LoadingIndicatorContainer;
    };
