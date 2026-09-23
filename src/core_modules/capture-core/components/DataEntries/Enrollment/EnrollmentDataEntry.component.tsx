/* eslint-disable react/no-multi-comp */
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { type OrgUnit } from '@dhis2/rules-engine-javascript';
import { convertDateObjectToDateFormatString } from 'capture-core/utils/converters/date';
import { isLangRtl } from '../../../utils/rtl';
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
    orientations,
    SingleSelectField,
} from '../../FormFields/New';
import labelTypeClasses from './fieldLabels.module.css';
import {
    getEnrollmentDateValidatorContainer,
    getIncidentDateValidatorContainer,
} from './fieldValidators';
import { sectionKeysForEnrollmentDataEntry } from './constants/sectionKeys.const';
import {
    type Enrollment,
    ProgramStage,
    RenderFoundation,
    getProgramThrowIfNotFound,
    LabelKeys,
    useTermLabel,
    type CustomLabels,
} from '../../../metaData';
import { EnrollmentWithFirstStageDataEntry } from './EnrollmentWithFirstStageDataEntry';
import {
    getCategoryOptionsValidatorContainers,
    getEnrollmentCategoryOptionsValidatorContainers,
    attributeOptionsKey,
    enrollmentAttributeOptionsKey,
    AOCsectionKey,
    enrollmentAOCsectionKey,
    withAOCFieldBuilder,
    withEnrollmentAOCFieldBuilder,
    withDataEntryFields,
} from '../../DataEntryDhis2Helpers';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';
import { relatedStageActions } from '../../WidgetRelatedStages';

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

const getCalendarAnchorPosition = (formHorizontal: boolean | null) => {
    if (formHorizontal) {
        return 'center';
    }
    return isLangRtl() ? 'right' : 'left';
};

const getEnrollmentDateSettings = () => {
    const reportDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withLabel({
                        onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: any) =>
                            `${props.fieldOptions &&
                                props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withFilterProps(defaultFilterProps)(DateField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const enrollmentDateSettings = {
        getComponent: () => reportDateComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.enrollmentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarMax: !props.enrollmentMetadata.allowFutureEnrollmentDate ?
                convertDateObjectToDateFormatString(moment()) :
                undefined,
            calendarType: systemSettingsStore.get().calendar,
            dateFormat: systemSettingsStore.get().dateFormat,
        }),
        getPropName: () => 'enrolledAt',
        getValidatorContainers: getEnrollmentDateValidatorContainer,
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
                    withLabel({
                        onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: any) =>
                            `${props.fieldOptions &&
                                props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withFilterProps(defaultFilterProps)(DateField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const incidentDateSettings = {
        isApplicable: (props: any) => {
            const showIncidentDate = props.enrollmentMetadata.showIncidentDate;
            return showIncidentDate;
        },
        getComponent: () => reportDateComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.enrollmentMetadata.incidentDateLabel,
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
            calendarMax: !props.enrollmentMetadata.allowFutureIncidentDate ?
                convertDateObjectToDateFormatString(moment()) :
                undefined,
            calendarType: systemSettingsStore.get().calendar,
            dateFormat: systemSettingsStore.get().dateFormat,
        }),
        getPropName: () => 'occurredAt',
        getPassOnFieldData: () => true,
        getValidatorContainers: getIncidentDateValidatorContainer,
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
            withLabel({
                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                onGetCustomFieldLabeClass: (props: any) =>
                    `${props.fieldOptions &&
                        props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
            })(
                withDisplayMessages()(
                    withInternalChangeHandler()(
                        withFilterProps(defaultFilterProps)(CoordinateField),
                    ),
                ),
            ),
        ),
    ),
);

const polygonComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withLabel({
                onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                onGetCustomFieldLabeClass: (props: any) =>
                    `${props.fieldOptions &&
                        props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
            })(
                withDisplayMessages()(
                    withInternalChangeHandler()(
                        withFilterProps(defaultFilterProps)(PolygonField),
                    ),
                ),
            ),
        ),
    ),
);

const getOrientation = (formHorizontal: boolean | null) =>
    (formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL);

const getGeometrySettings = () => ({
    isApplicable: (props: any) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: any) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }

        return pointComponent;
    },
    getComponentProps: (props: any) => {
        const featureType = props.enrollmentMetadata.enrollmentForm.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orientation: getOrientation(props.formHorizontal),
                orgUnitId: props.orgUnit?.id,
            });
        }

        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orientation: getOrientation(props.formHorizontal),
            shrinkDisabled: props.formHorizontal,
            orgUnitId: props.orgUnit?.id,
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

const categoryOptionsComponent =
    withCalculateMessages(overrideMessagePropNames)(
        withFocusSaver()(
            withDefaultFieldContainer()(
                withLabel({
                    onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: any) =>
                        `${props.fieldOptions &&
                            props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.selectLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(SingleSelectField),
                        ),
                    ),
                ),
            ),
        ),
    );

const getEventCategoryOptionsSettingsFn = () => ({
    getComponent: () => categoryOptionsComponent,
    getComponentProps: (props: any, fieldId: string) => createComponentProps(props, {
        ...props.categories?.find((category: any) => category.id === fieldId) ?? {},
        required: true,
    }),
    getPropName: (props: any, fieldId?: string) => (fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey),
    getFieldIds: (props: any) => props.categories?.map((category: any) => category.id),
    getValidatorContainers: (props: any, fieldId?: string) => getCategoryOptionsValidatorContainers(props, fieldId),
    getMeta: (props: any) => {
        const { firstStageMetaData, programCategory, termLabels } = props;
        const eventLabel = termLabels?.eventLabel;
        const categoryDisplayName = programCategory?.displayName;

        return {
            section: AOCsectionKey,
            placement: placements.BOTTOM,
            sectionName: firstStageMetaData
                ? i18n.t('{{eventLabel}} - {{stageName}} - {{categoryDisplayName}}', {
                    eventLabel,
                    stageName: firstStageMetaData.stage.name,
                    categoryDisplayName,
                })
                : i18n.t('{{eventLabel}} - {{categoryDisplayName}}', { eventLabel, categoryDisplayName }),
        };
    },
});

const getAOCSettingsFn = () => ({
    hideAOC: ({ programId }: { programId: string }) => {
        const { stages: stagesMap, useFirstStageDuringRegistration } = getProgramThrowIfNotFound(programId);

        /*
        Show AOC selection if:
        - There are any program stages in the program with "Auto-generate"
        - The "Show first stage on registration page" is selected for the program
        */

        const stages = [...stagesMap.values()];

        const shouldShowAOC = stages.some((stage: any) => stage.autoGenerateEvent) || useFirstStageDuringRegistration;

        return !shouldShowAOC;
    },
});

const getEnrollmentCategoryOptionsSettingsFn = () => ({
    getComponent: () => categoryOptionsComponent,
    getComponentProps: (props: any, fieldId: string) => createComponentProps(props, {
        ...props.enrollmentCategories?.find((category: any) => category.id === fieldId) ?? {},
        required: true,
    }),
    getPropName: (props: any, fieldId?: string) =>
        (fieldId ? `${enrollmentAttributeOptionsKey}-${fieldId}` : enrollmentAttributeOptionsKey),
    getFieldIds: (props: any) => props.enrollmentCategories?.map((category: any) => category.id),
    getValidatorContainers: (props: any, fieldId?: string) =>
        getEnrollmentCategoryOptionsValidatorContainers(props, fieldId),
    getMeta: (props: any) => {
        const { enrollmentProgramCategory, termLabels } = props;

        return {
            section: enrollmentAOCsectionKey,
            placement: placements.TOP,
            sectionName: i18n.t('{{enrollmentLabel}} - {{categoryDisplayName}}', {
                enrollmentLabel: termLabels?.enrollmentLabel,
                categoryDisplayName: enrollmentProgramCategory?.displayName,
            }),
        };
    },
});

const getEnrollmentAOCSettingsFn = () => ({});

type FinalTeiDataEntryProps = {
    enrollmentMetadata: Enrollment;
    programId: string;
    id: string;
    orgUnitId: string;
    orgUnit: OrgUnit;
    onUpdateDataEntryField: (...args: any[]) => any;
    onUpdateFormFieldAsync: (...args: any[]) => any;
    onUpdateFormField: (...args: any[]) => any;
    firstStageMetaData?: { stage: ProgramStage } | null;
    relatedStageRef?: { current: RelatedStageRefPayload | null };
    relatedStageActionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
    formFoundation: RenderFoundation;
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
        [enrollmentAOCsectionKey]: {
            placement: placements.TOP,
        },
        [AOCsectionKey]: {
            placement: placements.BOTTOM,
        },
    };

    render() {
        const { enrollmentMetadata, firstStageMetaData, relatedStageActionsOptions, ...passOnProps } = this.props;

        return (
            firstStageMetaData ? (
                <EnrollmentWithFirstStageDataEntry
                    {...passOnProps}
                    firstStageMetaData={firstStageMetaData}
                    relatedStageActionsOptions={relatedStageActionsOptions}
                />
            ) : (
                <DataEntry
                    {...passOnProps}
                    dataEntrySections={FinalEnrollmentDataEntry.dataEntrySectionDefinitions}
                />
            )
        );
    }
}

const AOCFieldBuilderHOC = withEnrollmentAOCFieldBuilder(getEnrollmentAOCSettingsFn())(
    withDataEntryFields(getEnrollmentCategoryOptionsSettingsFn())(
        withAOCFieldBuilder(getAOCSettingsFn())(
            withDataEntryFields(getEventCategoryOptionsSettingsFn())(FinalEnrollmentDataEntry),
        ),
    ),
);
const LocationHOC = withDataEntryFieldIfApplicable(getGeometrySettings())(AOCFieldBuilderHOC);
const IncidentDateFieldHOC = withDataEntryFieldIfApplicable(getIncidentDateSettings())(LocationHOC);
const EnrollmentDateFieldHOC = withDataEntryField(getEnrollmentDateSettings())(IncidentDateFieldHOC);
const BrowserBackWarningHOC = withBrowserBackWarning()(EnrollmentDateFieldHOC);

type PreEnrollmentDataEntryProps = {
    programId: string;
    orgUnit: OrgUnit;
    onUpdateField: (...args: any[]) => any;
    onUpdateDataEntryField: (...args: any[]) => any;
    onStartAsyncUpdateField: (...args: any[]) => any;
    onGetUnsavedAttributeValues?: (...args: any[]) => any;
    teiId?: string | null;
    firstStageMetaData?: { stage: ProgramStage } | null;
    formFoundation: RenderFoundation;
    enrollmentMetadata: Enrollment;
    id: string;
    onPostProcessErrorMessage: (message: string) => string;
    termLabels: CustomLabels;
};

class PreEnrollmentDataEntryPure extends React.PureComponent<any> {
    render() {
        return (
            <BrowserBackWarningHOC
                {...this.props}
            />
        );
    }
}

class EnrollmentDataEntryComponentClass extends React.Component<PreEnrollmentDataEntryProps> {
    getValidationContext = () => {
        const { orgUnit, onGetUnsavedAttributeValues, programId, teiId } = this.props;
        return {
            programId,
            orgUnitId: orgUnit.id,
            trackedEntityInstanceId: teiId,
            trackedEntityTypeId: this.props.enrollmentMetadata.trackedEntityType.id,
            onGetUnsavedAttributeValues,
        };
    }

    handleUpdateField = (...args: any[]) => {
        const { programId, orgUnit, firstStageMetaData, formFoundation } = this.props;
        this.props.onUpdateField(
            ...args,
            programId,
            orgUnit,
            firstStageMetaData?.stage,
            formFoundation,
            this.getValidationContext,
        );
    };

    handleUpdateDataEntryField = (...args: any[]) => {
        const { programId, orgUnit, firstStageMetaData, formFoundation } = this.props;
        this.props.onUpdateDataEntryField(
            ...args,
            programId,
            orgUnit,
            firstStageMetaData?.stage,
            formFoundation,
            this.getValidationContext,
        );
    }

    handleStartAsyncUpdateField = (...args: any[]) => {
        const { programId, orgUnit, firstStageMetaData, formFoundation } = this.props;
        this.props.onStartAsyncUpdateField(
            ...args,
            programId,
            orgUnit,
            firstStageMetaData?.stage,
            formFoundation,
            this.getValidationContext,
        );
    }

    render() {
        const {
            onUpdateField,
            onUpdateDataEntryField,
            onStartAsyncUpdateField,
            onGetUnsavedAttributeValues,
            orgUnit,
            ...passOnProps
        } = this.props;

        return (
            <PreEnrollmentDataEntryPure
                onGetValidationContext={this.getValidationContext}
                onUpdateFormField={this.handleUpdateField}
                onUpdateDataEntryField={this.handleUpdateDataEntryField}
                onUpdateFormFieldAsync={this.handleStartAsyncUpdateField}
                orgUnit={orgUnit}
                orgUnitId={orgUnit?.id}
                {...passOnProps}
            />
        );
    }
}

export const EnrollmentDataEntryComponent = (props: Omit<PreEnrollmentDataEntryProps, 'termLabels'>) => {
    const termLabels = useTermLabel(
        [LabelKeys.eventSingular, LabelKeys.enrollmentSingular],
        { programId: props.programId },
    );
    return <EnrollmentDataEntryComponentClass {...props} termLabels={termLabels} />;
};
