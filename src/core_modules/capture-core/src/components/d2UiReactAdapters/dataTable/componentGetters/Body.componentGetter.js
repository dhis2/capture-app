// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
};

const getBody = () => class Body extends React.Component<Props> {
    render() {
        return (
            <tbody>
                {this.props.children}
            </tbody>
        );
    }
};

export default getBody;
