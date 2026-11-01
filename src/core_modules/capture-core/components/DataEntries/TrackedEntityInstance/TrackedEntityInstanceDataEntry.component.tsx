/* eslint-disable react/no-multi-comp */
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import {
    DataEntry,
    placements,
    withDataEntryField,
    withBrowserBackWarning,
    inMemoryFileStore,
} from '../../DataEntry';
import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    withCalculateMessages,
    withDisplayMessages,
    withFilterProps,
    withDefaultFieldContainer,
    SingleOrgUnitSelectField,
} from '../../FormFields/New';
import labelTypeClasses from './fieldLabels.module.css';
import { getOrgUnitValidatorContainers } from './fieldValidators';
import { LabelKeys, withCustomLabels } from '../../../customLabels';
import type { TeiRegistration, RenderFoundation } from '../../../metaData';

const customLabels = [LabelKeys.orgUnitSingular] as const;

const dataEntrySectionNames = {
    REGISTRATION: 'REGISTRATION',
};

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};
const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
};

function defaultFilterProps(props: any) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getBaseComponentProps = (props: any) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: any, componentProps: any) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const getOrgUnitSettings = () => {
    const orgUnitComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withLabel({
                        onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: any) =>
                            `${props.fieldOptions?.fieldLabelMediaBasedClass} ${labelTypeClasses.orgUnitLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withFilterProps(defaultFilterProps)(SingleOrgUnitSelectField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const orgUnitSettings = {
        getComponent: () => orgUnitComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props?.formHorizontal ? 150 : 350,
            label: capitalizeFirstLetter(props.orgUnitLabel),
            required: true,
        }),
        getPropName: () => 'orgUnit',
        getValidatorContainers: (props: any) => getOrgUnitValidatorContainers(props.orgUnitLabel),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.REGISTRATION,
        }),
    };

    return orgUnitSettings;
};

type FinalTeiDataEntryProps = {
    teiRegistrationMetadata: TeiRegistration;
    id: string;
    onUpdateFormFieldAsync: (...args: any[]) => any;
};

class FinalTeiDataEntry extends React.Component<FinalTeiDataEntryProps> {
    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    render() {
        const { teiRegistrationMetadata, ...passOnProps } = this.props;
        const dataEntrySections = {
            [dataEntrySectionNames.REGISTRATION]: {
                placement: placements.TOP,
                name: i18n.t('Registration'),
            },
        };

        return (
            <DataEntry
                {...passOnProps}
                formFoundation={teiRegistrationMetadata.form}
                dataEntrySections={dataEntrySections}
            />
        );
    }
}

const OrgUnitFieldHOC = withDataEntryField(getOrgUnitSettings())(FinalTeiDataEntry);
const CustomLabelsHOC = withCustomLabels(customLabels)(OrgUnitFieldHOC);
const BrowserBackWarningHOC = withBrowserBackWarning()(CustomLabelsHOC);

class PreTeiDataEntryPure extends React.PureComponent<Record<string, unknown>> {
    render() {
        return (
            <BrowserBackWarningHOC
                {...this.props}
            />
        );
    }
}

type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

type PreTeiDataEntryProps = {
    orgUnitId: string;
    orgUnitFieldValue?: OrgUnit | null;
    trackedEntityTypeId: string;
    onUpdateField: (field: string, value: any) => void;
    onStartAsyncUpdateField: (field: string, value: any) => void;
    teiRegistrationMetadata: TeiRegistration | null;
    onGetUnsavedAttributeValues: ((field: string, value: any) => void) | null;
    fieldOptions: any;
    formFoundation: RenderFoundation;
    id: string;
    onPostProcessErrorMessage: (message: string) => string;
};

export class PreTeiDataEntry extends React.Component<PreTeiDataEntryProps> {
    getValidationContext = () => {
        const { orgUnitFieldValue, onGetUnsavedAttributeValues, trackedEntityTypeId } = this.props;
        return {
            trackedEntityTypeId,
            orgUnitId: orgUnitFieldValue?.id,
            onGetUnsavedAttributeValues,
        };
    }

    render() {
        const {
            trackedEntityTypeId,
            onUpdateField,
            onStartAsyncUpdateField,
            teiRegistrationMetadata,
            onGetUnsavedAttributeValues,
            orgUnitFieldValue,
            ...passOnProps } = this.props;

        if (!teiRegistrationMetadata) {
            return (
                <div>
                    {i18n.t('An error has occurred. See log for details')}
                </div>
            );
        }

        return (
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
