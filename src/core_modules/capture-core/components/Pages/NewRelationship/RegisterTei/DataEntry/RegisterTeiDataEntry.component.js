// @flow
import * as React from 'react';
import { DataEntryTrackedEntityInstance } from './TrackedEntityInstance';
import { DataEntryEnrollment } from './Enrollment';

type Props = {
    showDataEntry: boolean,
    programId: string,
};

export class RegisterTeiDataEntryComponent extends React.Component<Props> {
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
