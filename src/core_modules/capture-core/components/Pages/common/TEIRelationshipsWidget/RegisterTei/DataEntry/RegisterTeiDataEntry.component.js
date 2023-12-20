// @flow
import * as React from 'react';
import { DataEntryEnrollment } from './Enrollment';
import { DataEntryTrackedEntityInstance } from './TrackedEntityInstance';

type Props = {
    showDataEntry: boolean,
    programId: string,
    onSaveWithoutEnrollment: () => void,
    onSaveWithEnrollment: () => void,
};

export class RegisterTeiDataEntryComponent extends React.Component<Props> {
    render() {
        const {
            showDataEntry,
            programId,
            onSaveWithoutEnrollment,
            onSaveWithEnrollment,
            ...passOnProps
        } = this.props;

        if (!showDataEntry) {
            return null;
        }

        if (programId) {
            return (
                <DataEntryEnrollment
                    {...passOnProps}
                    onSave={onSaveWithEnrollment}
                />
            );
        }

        return (
            <DataEntryTrackedEntityInstance
                {...passOnProps}
                onSave={onSaveWithoutEnrollment}
            />
        );
    }
}
