// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
};

const getFooter = () => class Footer extends React.Component<Props> {
    static childContextTypes = {
        table: React.PropTypes.object,
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
};

export default getFooter;
