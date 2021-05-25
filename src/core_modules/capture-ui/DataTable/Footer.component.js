// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

type Props = {
    children: React.Node,
};

export class Footer extends React.Component<Props> {
    static childContextTypes = {
        table: PropTypes.object,
    };

    getChildContext() {
        // eslint-disable-line class-methods-use-this
        return {
            table: {
                footer: true,
            },
        };
    }

    render() {
        return (
            <tfoot>
                {this.props.children}
            </tfoot>
        );
    }
}
