// @flow
import * as React from 'react';
import { DataEntryEnrollment } from './Enrollment';
import { DataEntryTrackedEntityInstance } from './TrackedEntityInstance';

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
