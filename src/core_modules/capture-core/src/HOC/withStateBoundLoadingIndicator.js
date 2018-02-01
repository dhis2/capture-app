// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// d2-ui
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

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

export default (isReadyFn: (state: State) => boolean) => (InnerComponent: React.ComponentType<any>) => {
    const mapStateToProps = (state: State) => ({
        ready: isReadyFn(state),
    });

    const mergeProps = (stateProps, dispatchProps, ownProps) =>
        Object.assign({}, ownProps, stateProps, dispatchProps, {
            InnerComponent,
        });

    const LoadingIndicatorContainer = connect(mapStateToProps, null, mergeProps)(LoadingIndicator);
    return LoadingIndicatorContainer;
};
