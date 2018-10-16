// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
    children: React.Node,
};

class Head extends React.Component<Props> {
    static childContextTypes = {
        table: PropTypes.object,
    };

    getChildContext() {
        // eslint-disable-line class-methods-use-this
        return {
            table: {
                head: true,
            },
        };
    }

    render() {
        return (
            <thead>
                {this.props.children}
            </thead>
        );
    }
}

export default Head;
