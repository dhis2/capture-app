// @flow
import { connect } from 'react-redux';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    DataEntry,
    placements,
    withDataEntryField,
    withDataEntryFieldIfApplicable,
    withFeedbackOutput,
    withIndicatorOutput,
    withErrorOutput,
    withWarningOutput,
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
} from '../../FormFields/New';

import labelTypeClasses from './fieldLabels.mod.css';
import {
    getEnrollmentDateValidatorContainer,
    getIncidentDateValidatorContainer,
} from './fieldValidators';
import dataEntrySectionKeys from './constants/sectionKeys.const';

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
                            onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
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
    const enrollmentDateSettings = (props: Object) => ({
        component: reportDateComponent,
        componentProps: createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.enrollmentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
        }),
        propName: 'enrollmentDate',
        validatorContainers: getEnrollmentDateValidatorContainer(),
        meta: {
            placement: placements.TOP,
            section: dataEntrySectionKeys.ENROLLMENT,
        },
    });

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
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
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
    const incidentDateSettings = (props: Object) => ({
        component: reportDateComponent,
        componentProps: createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.incidentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
        }),
        propName: 'incidentDate',
        validatorContainers: getIncidentDateValidatorContainer(),
        meta: {
            placement: placements.TOP,
            section: dataEntrySectionKeys.ENROLLMENT,
        },
    });

    return incidentDateSettings;
};

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) =>
                        `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
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
                        `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
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

const getGeometrySettings = () => (props: Object) => {
    const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
    if (featureType === 'Polygon') {
        return {
            component: polygonComponent,
            componentProps: createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
            }),
            propName: 'geometry',
            validatorContainers: [
            ],
            meta: {
                placement: placements.TOP,
                section: dataEntrySectionKeys.ENROLLMENT,
            },
        };
    }
    if (featureType === 'Point') {
        return {
            component: pointComponent,
            componentProps: createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Coordinate'),
                dialogLabel: i18n.t('Coordinate'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
                shrinkDisabled: props.formHorizontal,
            }),
            propName: 'geometry',
            validatorContainers: [
            ],
            meta: {
                placement: placements.TOP,
                section: dataEntrySectionKeys.ENROLLMENT,
            },
        };
    }
    return null;
};

const FilterPropsForDataEntry = (props: Object) => {
    const { enrollmentMetadata, ...passOnProps } = props;
    return (
        <DataEntry
            {...passOnProps}
            formFoundation={enrollmentMetadata.enrollmentForm}
        />
    );
};

const mapStateToProps = (state: ReduxState) => ({
    onGetValidationContext: () => ({
        orgUnitId: state.currentSelections.orgUnitId,
    }),
});

const ValidationContext = connect(mapStateToProps, () => ({}))(FilterPropsForDataEntry);
const FeedbackOutput = withFeedbackOutput()(ValidationContext);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const LocationHOC = withDataEntryFieldIfApplicable(getGeometrySettings())(ErrorOutput);
const IncidentDateFieldHOC = withDataEntryField(getIncidentDateSettings())(LocationHOC);
const EnrollmentDateFieldHOC = withDataEntryField(getEnrollmentDateSettings())(IncidentDateFieldHOC);
const BrowserBackWarningHOC = withBrowserBackWarning()(EnrollmentDateFieldHOC);
export default BrowserBackWarningHOC;
