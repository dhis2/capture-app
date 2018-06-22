// @flow
import * as React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state: ReduxState) => ({
    header: 'test',
});

export default () => (InnerComponent: React.ComponentType<any>) =>
    connect(mapStateToProps)(InnerComponent);
