// @flow
import * as React from 'react';
import { Enrollment } from './Enrollment';

type Props = {};

class RegisterTei extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <Enrollment
                {...passOnProps}
            />
        );
    }
}

export default RegisterTei;
