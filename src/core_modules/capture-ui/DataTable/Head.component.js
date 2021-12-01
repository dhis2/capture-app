// @flow
import PropTypes from 'prop-types';
import * as React from 'react';

type Props = {
    children: React.Node,
};

export class Head extends React.Component<Props> {
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
