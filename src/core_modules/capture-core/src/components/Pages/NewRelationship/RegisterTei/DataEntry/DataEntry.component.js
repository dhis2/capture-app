// @flow
import * as React from 'react';
import { Enrollment } from '../Enrollment';
import { TrackedEntityInstance } from '../TrackedEntityInstance';

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
            <TrackedEntityInstance
                {...passOnProps}
            />
        );
    }
}

export default RegisterTeiDataEntry;
