// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
};

const getHead = () => class Head extends React.Component<Props> {
    static childContextTypes = {
        table: React.PropTypes.object,
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
};

export default getHead;
