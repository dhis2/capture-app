// @flow
import * as React from 'react';
import { Enrollment } from './Enrollment';

type Props = {
    showDataEntry: boolean,
    programId: string,
};

class RegisterTeiDataEntry extends React.Component<Props> {
    render() {
        const { showDataEntry, programId, ...passOnProps } = this.props;

        if (!showDataEntry) {
            return null;
        }

        if (programId) {
            return (
                <Enrollment
                    {...passOnProps}
                />
            );
        }

        return (
            <Enrollment
                {...passOnProps}
            />
        );
    }
}

export default RegisterTeiDataEntry;
