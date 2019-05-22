// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import getD2 from '../d2/d2Instance';

export default () => (InnerComponent: React.ComponentType<any>) => class D2ContextAdder extends React.Component<any> {
    static childContextTypes = {
        d2: PropTypes.object,
    };

    getChildContext() {
        return {
            d2: getD2(),
        };
    }

    render() {
        return (
            <InnerComponent
                {...this.props}
            />
        );
    }
};
