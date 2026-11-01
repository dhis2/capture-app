import * as React from 'react';
import { DataEntryEnrollment } from './Enrollment';
import { DataEntryTrackedEntityInstance } from './TrackedEntityInstance';

type Props = {
    programId: string;
};

export class RegisterTeiDataEntryComponent extends React.Component<Props> {
    render() {
        const { programId, ...passOnProps } = this.props;

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
