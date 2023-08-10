// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { type OrgUnit } from '@dhis2/rules-engine-javascript';
import {
    DataEntry,
    placements,
    withDataEntryField,
    withDataEntryFieldIfApplicable,
    withBrowserBackWarning,
    inMemoryFileStore,
} from '../../DataEntry';
import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    DateField,
    CoordinateField,
    PolygonField,
    withCalculateMessages,
    withDisplayMessages,
    withFilterProps,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    orientations,
    VirtualizedSelectField,
} from '../../FormFields/New';
import labelTypeClasses from './fieldLabels.module.css';
import {
    getEnrollmentDateValidatorContainer,
    getIncidentDateValidatorContainer,
} from './fieldValidators';
import { sectionKeysForEnrollmentDataEntry } from './constants/sectionKeys.const';
import { withCenterPoint } from '../../DataEntry/withCenterPoint';
import { type Enrollment, getProgramThrowIfNotFound } from '../../../metaData';
import {
    getCategoryOptionsValidatorContainers,
    attributeOptionsKey,
    AOCsectionKey,
    withAOCFieldBuilder,
    withDataEntryFields,
} from '../../DataEntryDhis2Helpers';
import { shouldUseNewDashboard } from '../../../utils/routing';

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

function defaultFilterProps(props: Object) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getBaseComponentProps = (props: Object) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const getCalendarAnchorPosition = (formHorizontal: ?boolean) => (formHorizontal ? 'center' : 'left');

const getEnrollmentDateSettings = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(DateField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const enrollmentDateSettings = {
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.enrollmentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarMaxMoment: !props.enrollmentMetadata.allowFutureEnrollmentDate ? moment() : undefined,
        }),
        getPropName: () => 'enrolledAt',
        getValidatorContainers: (props: Object) =>
            getEnrollmentDateValidatorContainer(props.enrollmentMetadata.allowFutureEnrollmentDate),
        getPassOnFieldData: () => true,
        getMeta: () => ({
            placement: placements.TOP,
            section: sectionKeysForEnrollmentDataEntry.ENROLLMENT,
        }),
    };

    return enrollmentDateSettings;
};


const getIncidentDateSettings = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(DateField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const incidentDateSettings = {
        isApplicable: (props: Object) => {
            const showIncidentDate = props.enrollmentMetadata.showIncidentDate;
            return showIncidentDate;
        },
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.incidentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarMaxMoment: !props.enrollmentMetadata.allowFutureIncidentDate ? moment() : undefined,
        }),
        getPropName: () => 'occurredAt',
        getPassOnFieldData: () => true,
        getValidatorContainers: (props: Object) =>
            getIncidentDateValidatorContainer(props.enrollmentMetadata.allowFutureIncidentDate),
        getMeta: () => ({
            placement: placements.TOP,
            section: sectionKeysForEnrollmentDataEntry.ENROLLMENT,
        }),
    };

    return incidentDateSettings;
};

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(CoordinateField),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

const polygonComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(PolygonField),
                        ),
                    ),
                ),
            ),
        ),
    ),
);

const getOrientation = (formHorizontal: ?boolean) => (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);

const getGeometrySettings = () => ({
    isApplicable: (props: Object) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: Object) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }

        return pointComponent;
    },
    getComponentProps: (props: Object) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
                center: props.center,
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
            center: props.center,
        });
    },
    getPropName: () => 'geometry',
    getValidatorContainers: () => [],
    getPassOnFieldData: () => true,
    getMeta: () => ({
        placement: placements.TOP,
        section: sectionKeysForEnrollmentDataEntry.ENROLLMENT,
    }),
});

const getCategoryOptionsSettingsFn = () => {
    const categoryOptionsComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.selectLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(VirtualizedSelectField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const categoryOptionsSettings = {
        getComponent: () => categoryOptionsComponent,
        getComponentProps: (props: Object, fieldId: string) => createComponentProps(props, {
            ...props.categories?.find(category => category.id === fieldId) ?? {},
            required: true,
        }),
        getPropName: (props: Object, fieldId?: string) => (fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey),
        getFieldIds: (props: Object) => props.categories?.map(category => category.id),
        getValidatorContainers: (props: Object, fieldId?: string) => getCategoryOptionsValidatorContainers(props, fieldId),
        getMeta: (props: Object) => ({
            section: AOCsectionKey,
            placement: placements.BOTTOM,
            sectionName: props.programCategory?.displayName,
        }),
    };

    return categoryOptionsSettings;
};

const getAOCSettingsFn = () => ({
    hideAOC: ({ programId, newDashboardConfig }) => {
        const { stages: stagesMap } = getProgramThrowIfNotFound(programId);

        /*
        Show AOC selection if:
        - There are any program stages in the program with “Auto-generate" event and NOT “Open data entry form after enrollment”.
        - There are multiple program stages with "Auto-generate" event and "Open data entry form after enrollment"
            (in this scenario we are currently generating events for the program stages that are not the first one)
        - Using the old dashboard and we have a stage with auto generate event.
        */

        const stages = [...stagesMap.values()];

        const usingNewDashboardForProgram = shouldUseNewDashboard(
            newDashboardConfig.userDataStore,
            newDashboardConfig.dataStore,
            newDashboardConfig.temp,
            programId,
        );

        const shouldShowAOC = (!usingNewDashboardForProgram && stages.some(stage => stage.autoGenerateEvent)) ||
        stages.some(stage => stage.autoGenerateEvent && !stage.openAfterEnrollment) ||
            stages.filter(stage => stage.autoGenerateEvent && stage.openAfterEnrollment).length > 1;

        return !shouldShowAOC;
    },
});

type FinalTeiDataEntryProps = {
    enrollmentMetadata: Enrollment,
    programId: string,
    id: string,
    orgUnitId: string,
    onUpdateDataEntryField: Function,
    onUpdateFormFieldAsync: Function,
    onUpdateFormField: Function
};
// final step before the generic dataEntry is inserted
class FinalEnrollmentDataEntry extends React.Component<FinalTeiDataEntryProps> {
    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    static dataEntrySectionDefinitions = {
        [sectionKeysForEnrollmentDataEntry.ENROLLMENT]: {
            placement: placements.TOP,
            name: i18n.t('Enrollment'),
        },
        [AOCsectionKey]: {
            placement: placements.BOTTOM,
        },
    };

    render() {
        const { enrollmentMetadata, ...passOnProps } = this.props;
        return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
            <DataEntry
                {...passOnProps}
                dataEntrySections={FinalEnrollmentDataEntry.dataEntrySectionDefinitions}
                formFoundation={enrollmentMetadata.enrollmentForm}
            />
        );
    }
}

const AOCFieldBuilderHOC = withAOCFieldBuilder(getAOCSettingsFn())(
    withDataEntryFields(
        getCategoryOptionsSettingsFn(),
    )(FinalEnrollmentDataEntry));
const LocationHOC = withDataEntryFieldIfApplicable(getGeometrySettings())(AOCFieldBuilderHOC);
const CenterPointHOC = withCenterPoint()(LocationHOC);
const IncidentDateFieldHOC = withDataEntryFieldIfApplicable(getIncidentDateSettings())(CenterPointHOC);
const EnrollmentDateFieldHOC = withDataEntryField(getEnrollmentDateSettings())(IncidentDateFieldHOC);
const BrowserBackWarningHOC = withBrowserBackWarning()(EnrollmentDateFieldHOC);

type PreEnrollmentDataEntryProps = {
    programId: string,
    orgUnit: OrgUnit,
    onUpdateField: Function,
    onUpdateDataEntryField: Function,
    onStartAsyncUpdateField: Function,
    onGetUnsavedAttributeValues?: ?Function,
    teiId?: ?string,
};

class PreEnrollmentDataEntryPure extends React.PureComponent<Object> {
    render() {
        return (
            <BrowserBackWarningHOC
                {...this.props}
            />
        );
    }
}

export class EnrollmentDataEntryComponent extends React.Component<PreEnrollmentDataEntryProps> {
    getValidationContext = () => {
        const { orgUnit, onGetUnsavedAttributeValues, programId, teiId } = this.props;
        return {
            programId,
            orgUnitId: orgUnit.id,
            trackedEntityInstanceId: teiId,
            onGetUnsavedAttributeValues,
        };
    }

    handleUpdateField = (...args: Array<any>) => {
        const { programId, orgUnit } = this.props;
        this.props.onUpdateField(...args, programId, orgUnit);
    }

    handleUpdateDataEntryField = (...args: Array<any>) => {
        const { programId, orgUnit } = this.props;
        this.props.onUpdateDataEntryField(...args, programId, orgUnit);
    }

    handleStartAsyncUpdateField = (...args: Array<any>) => {
        const { programId, orgUnit } = this.props;
        this.props.onStartAsyncUpdateField(...args, programId, orgUnit);
    }

    render() {
        const {
            onUpdateField,
            onUpdateDataEntryField,
            onStartAsyncUpdateField,
            onGetUnsavedAttributeValues,
            ...passOnProps
        } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <PreEnrollmentDataEntryPure
                onGetValidationContext={this.getValidationContext}
                onUpdateFormField={this.handleUpdateField}
                onUpdateDataEntryField={this.handleUpdateDataEntryField}
                onUpdateFormFieldAsync={this.handleStartAsyncUpdateField}
                {...passOnProps}
            />
        );
    }
}
