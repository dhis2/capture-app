// @flow
import * as React from 'react';
import { DataEntryEnrollment } from './Enrollment';
import { DataEntryTrackedEntityInstance } from './TrackedEntityInstance';
import withErrorMessagePostProcessor from './withErrorMessagePostProcessor';

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
                <DataEntryEnrollment
                    {...passOnProps}
                />
            );
        }

        return (
            <DataEntryTrackedEntityInstance
                {...passOnProps}
            />
        );
    }
}

export default withErrorMessagePostProcessor()(RegisterTeiDataEntry);
