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
    componentDidMount() {
        // Force reinitialization when component is mounted
        // This ensures plugins are triggered when the component is remounted
    }

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
                    key={`enrollment-${Date.now()}`}
                />
            );
        }

        return (
            <DataEntryTrackedEntityInstance
                {...passOnProps}
                onSave={onSaveWithoutEnrollment}
                key={`tei-${Date.now()}`}
            />
        );
    }
}
