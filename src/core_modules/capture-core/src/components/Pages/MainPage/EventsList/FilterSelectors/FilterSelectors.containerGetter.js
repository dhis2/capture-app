// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import getFilterSelectorsComponent from './FilterSelectors.componentGetter';

const mapStateToProps = (state: ReduxState) => ({
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
});

export default (InnerComponent: React.ComponentType<any>) =>
    connect(mapStateToProps, mapDispatchToProps)(getFilterSelectorsComponent(InnerComponent));
