// @flow
/* eslint-disable react/no-multi-comp */
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import type { TeiRegistration } from '../../../metaData';
import {
    DataEntry,
    withBrowserBackWarning,
    inMemoryFileStore,
} from '../../DataEntry';

type FinalTeiDataEntryProps = {
    teiRegistrationMetadata: TeiRegistration,
};
// final step before the generic dataEntry is inserted
class FinalTeiDataEntry extends React.Component<FinalTeiDataEntryProps> {
    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    render() {
        const { teiRegistrationMetadata, ...passOnProps } = this.props;
        return (
            <DataEntry
                {...passOnProps}
                formFoundation={teiRegistrationMetadata.form}
            />
        );
    }
}

const BrowserBackWarningHOC = withBrowserBackWarning()(FinalTeiDataEntry);

class PreTeiDataEntryPure extends React.PureComponent<Object> {
    render() {
        return (
            <BrowserBackWarningHOC
                {...this.props}
            />
        );
    }
}

type PreTeiDataEntryProps = {
    orgUnit: Object,
    trackedEntityTypeId: string,
    onUpdateField: Function,
    onStartAsyncUpdateField: Function,
    teiRegistrationMetadata: ?TeiRegistration,
    onGetUnsavedAttributeValues?: ?Function,
};

export class PreTeiDataEntry extends React.Component<PreTeiDataEntryProps> {
    getValidationContext = () => {
        const { orgUnit, onGetUnsavedAttributeValues, trackedEntityTypeId } = this.props;
        return {
            trackedEntityTypeId,
            orgUnitId: orgUnit.id,
            onGetUnsavedAttributeValues,
        };
    }

    render() {
        const {
            orgUnit,
            trackedEntityTypeId,
            onUpdateField,
            onStartAsyncUpdateField,
            teiRegistrationMetadata,
            onGetUnsavedAttributeValues,
            ...passOnProps } = this.props;

        if (!teiRegistrationMetadata) {
            return (
                <div>
                    {i18n.t('An error has occurred. See log for details')}
                </div>
            );
        }

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <PreTeiDataEntryPure
                onGetValidationContext={this.getValidationContext}
                onUpdateFormField={onUpdateField}
                onUpdateFormFieldAsync={onStartAsyncUpdateField}
                teiRegistrationMetadata={teiRegistrationMetadata}
                {...passOnProps}
            />
        );
    }
}
