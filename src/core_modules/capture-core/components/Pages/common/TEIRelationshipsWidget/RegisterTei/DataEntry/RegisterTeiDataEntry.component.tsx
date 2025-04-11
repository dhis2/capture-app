import React, { Component } from 'react';
import { DataEntryEnrollment } from './Enrollment';
import { DataEntryTrackedEntityInstance } from './TrackedEntityInstance';
import { RegisterTeiDataEntryProps } from './RegisterTeiDataEntry.types';

export class RegisterTeiDataEntryComponent extends Component<RegisterTeiDataEntryProps> {
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
