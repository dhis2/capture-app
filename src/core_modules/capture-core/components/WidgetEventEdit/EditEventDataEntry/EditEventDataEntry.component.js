// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { dataEntryIds } from 'capture-core/constants';
import { TabBar, Tab } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getEventDateValidatorContainers } from '../DataEntry/fieldValidators/eventDate.validatorContainersGetter';
import type { RenderFoundation } from '../../../metaData';
import { withMainButton } from '../DataEntry/withMainButton';
import { withFilterProps } from '../../FormFields/New/HOC/withFilterProps';
import { WidgetEventSchedule } from '../../WidgetEventSchedule';
import {
    DataEntry,
    withSaveHandler,
    withCancelButton,
    withDataEntryField,
    withDataEntryFieldIfApplicable,
    placements,
    withCleanUp,
    withBrowserBackWarning,
} from '../../../components/DataEntry';
import {
    withInternalChangeHandler,
    withLabel,
    withFocusSaver,
    DateField,
    TrueOnlyField,
    CoordinateField,
    PolygonField,
    withCalculateMessages,
    withDisplayMessages,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    VirtualizedSelectField,
} from '../../FormFields/New';
import { statusTypes, translatedStatusTypes } from '../../../events/statusTypes';
import labelTypeClasses from '../DataEntry/dataEntryFieldLabels.module.css';
import { withDeleteButton } from '../DataEntry/withDeleteButton';
import { withAskToCreateNew } from '../../DataEntry/withAskToCreateNew';
import { withAskToCompleteEnrollment } from '../../DataEntries';
import { actionTypes } from './editEventDataEntry.actions';
import {
    AOCsectionKey,
    attributeOptionsKey,
    getCategoryOptionsValidatorContainers,
    withAOCFieldBuilder,
    withDataEntryFields,
} from '../../DataEntryDhis2Helpers/';
import type { UserFormField } from '../../FormFields/UserField';

const tabMode = Object.freeze({
    REPORT: 'REPORT',
    SCHEDULE: 'SCHEDULE',
});

const getStyles = (theme: Theme) => ({
    dataEntryContainer: {
    },
    fieldLabelMediaBased: {
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

const dataEntrySectionNames = {
    BASICINFO: 'BASICINFO',
    STATUS: 'STATUS',
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

function defaultFilterProps(props: Object) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getCancelOptions = () => ({
    color: 'primary',
});

const getBaseComponentProps = (props: Object) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

const buildReportDateSettingsFn = () => {
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
                                withInternalChangeHandler()(withFilterProps(defaultFilterProps)(DateField)),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const reportDateSettings = {
        getComponent: () => reportDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: '100%',
            calendarWidth: 350,
            label: props.formFoundation.getLabel('occurredAt'),
            required: true,
        }),
        getPropName: () => 'occurredAt',
        getValidatorContainers: () => getEventDateValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
};

const buildScheduleDateSettingsFn = () => {
    const scheduleDateComponent = innerProps =>
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                            customTooltip: () => {
                                const isScheduleableStatus =
                                [statusTypes.SCHEDULE, statusTypes.OVERDUE].includes(innerProps.eventStatus);

                                return isScheduleableStatus ?
                                    i18n.t('Go to “Schedule” tab to reschedule this event') :
                                    i18n.t('Scheduled date cannot be changed for {{ eventStatus }} events',
                                        { eventStatus: translatedStatusTypes()[innerProps.eventStatus] });
                            },
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(withFilterProps(defaultFilterProps)(DateField)),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const scheduleDateSettings = {
        getComponent: (props: Object) => scheduleDateComponent(props),
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: '100%',
            calendarWidth: 350,
            label: props.formFoundation.getLabel('scheduledAt'),
            disabled: true,
        }),
        getIsHidden: (props: Object) => props.id !== dataEntryIds.ENROLLMENT_EVENT || props.hideDueDate,
        getPropName: () => 'scheduledAt',
        getValidatorContainers: () => getEventDateValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return scheduleDateSettings;
};

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(withFilterProps(defaultFilterProps)(CoordinateField)),
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
                    onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
                })(
                    withDisplayMessages()(
                        withInternalChangeHandler()(withFilterProps(defaultFilterProps)(PolygonField)),
                    ),
                ),
            ),
        ),
    ),
);


const buildGeometrySettingsFn = () => ({
    isApplicable: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }
        return pointComponent;
    },
    getComponentProps: (props: Object) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orgUnit: props.orgUnit,
            });
        }
        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orgUnit: props.orgUnit,
        });
    },
    getPropName: () => 'geometry',
    getValidatorContainers: () => [],
    getMeta: () => ({
        placement: placements.TOP,
        section: dataEntrySectionNames.BASICINFO,
    }),
});

const buildCompleteFieldSettingsFn = () => {
    const completeComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(TrueOnlyField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const completeSettings = {
        getComponent: () => completeComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            label: i18n.t('Complete event'),
            id: 'complete',
        }),
        getPropName: () => 'complete',
        getValidatorContainers: () => [],
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.STATUS,
        }),
        getPassOnFieldData: () => true,
    };

    return completeSettings;
};

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
            placement: placements.TOP,
            sectionName: props.programCategory?.displayName,
        }),
    };

    return categoryOptionsSettings;
};

const saveHandlerConfig = {
    onIsCompleting: (props: Object) => props.completeDataEntryFieldValue === 'true',
    onFilterProps: (props: Object) => {
        const { completeDataEntryFieldValue, ...passOnProps } = props;
        return passOnProps;
    },
};

const AOCFieldBuilderHOC = withAOCFieldBuilder({})(withDataEntryFields(getCategoryOptionsSettingsFn())(DataEntry));
const CleanUpHOC = withCleanUp()(AOCFieldBuilderHOC);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CleanUpHOC);
const ScheduleDateField = withDataEntryField(buildScheduleDateSettingsFn())(GeometryField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(ScheduleDateField);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(ReportDateField));
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);
const CompletableDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(CancelableDataEntry);
const DeletableDataEntry = withDeleteButton()(CompletableDataEntry);
const AskToCreateNewDataEntry = withAskToCreateNew()(DeletableDataEntry);
const AskToCompleteEnrollment = withAskToCompleteEnrollment()(AskToCreateNewDataEntry);
const DataEntryWrapper = withBrowserBackWarning()(AskToCompleteEnrollment);

type Props = {
    formFoundation: ?RenderFoundation,
    orgUnit: OrgUnit,
    programId: string,
    itemId: string,
    initialScheduleDate?: string,
    onUpdateDataEntryField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void,
    onUpdateField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: (orgUnit: OrgUnit, programId: string) => void,
    onSave: (orgUnit: OrgUnit) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onSaveAndCompleteEnrollment: (
        orgUnit: OrgUnit,
    ) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onHandleScheduleSave: (eventData: Object) => void,
    onDelete: () => void,
    onCancel: () => void,
    onConfirmCreateNew: (itemId: string) => void,
    onCancelCreateNew: (itemId: string) => void,
    classes: {
        dataEntryContainer: string,
        fieldLabelMediaBased?: ?string,
    },
    theme: Theme,
    dataEntryId: string,
    onCancelEditEvent?: (isScheduled: boolean) => void,
    eventStatus?: string,
    enrollmentId?: string,
    isCompleted?: boolean,
    assignee?: UserFormField | null,
};


type DataEntrySection = {
    placement: $Values<typeof placements>,
    name?: string,
};

type State = {
    mode: string,
}

const dataEntrySectionDefinitions = {
    [dataEntrySectionNames.BASICINFO]: {
        placement: placements.TOP,
        name: i18n.t('Basic info'),
    },
    [AOCsectionKey]: {
        placement: placements.TOP,
    },
    [dataEntrySectionNames.STATUS]: {
        placement: placements.BOTTOM,
        name: i18n.t('Status'),
    },
};

class EditEventDataEntryPlain extends Component<Props, State> {
    fieldOptions: { theme: Theme };
    dataEntrySections: { [$Values<typeof dataEntrySectionNames>]: DataEntrySection };
    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
        this.state = { mode: tabMode.REPORT };
        this.onHandleSwitchTab = this.onHandleSwitchTab.bind(this);
    }

    onHandleSwitchTab = newMode => this.setState({ mode: newMode })

    renderScheduleView() {
        const {
            orgUnit,
            programId,
            eventStatus,
            onUpdateDataEntryField,
            onUpdateField,
            onStartAsyncUpdateField,
            onHandleScheduleSave,
            onSave,
            classes,
            dataEntryId,
            onCancelEditEvent,
            assignee,
            ...passOnProps
        } = this.props;

        return (
            <div>
                <TabBar dataTest="edit-event-tab-bar">
                    <Tab
                        key="report-tab"
                        selected={this.state.mode === tabMode.REPORT}
                        onClick={() => this.onHandleSwitchTab(tabMode.REPORT)}
                        dataTest="edit-event-report-tab"
                    >{i18n.t('Report')}</Tab>
                    <Tab
                        key="schedule-tab"
                        selected={this.state.mode === tabMode.SCHEDULE}
                        onClick={() => this.onHandleSwitchTab(tabMode.SCHEDULE)}
                        dataTest="edit-event-schedule-tab"
                    >{i18n.t('Schedule')}</Tab>
                </TabBar>
                {this.state.mode === tabMode.REPORT && this.renderDataEntry()}
                {this.state.mode === tabMode.SCHEDULE && // $FlowFixMe[cannot-spread-inexact] automated comment
                <WidgetEventSchedule
                    programId={programId}
                    onSave={onHandleScheduleSave}
                    orgUnitId={orgUnit.id}
                    onSaveSuccessActionType={actionTypes.EVENT_SCHEDULE_SUCCESS}
                    onSaveErrorActionType={actionTypes.EVENT_SCHEDULE_ERROR}
                    assignee={assignee}
                    {...passOnProps}
                />}
            </div>
        );
    }

    renderDataEntry() {
        const {
            dataEntryId,
            orgUnit,
            programId,
            onUpdateDataEntryField,
            onUpdateField,
            onStartAsyncUpdateField,
            onSave,
            onSaveAndCompleteEnrollment,
            classes,
            ...passOnProps
        } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DataEntryWrapper
                id={dataEntryId}
                onUpdateDataEntryField={onUpdateDataEntryField(orgUnit, programId)}
                onUpdateFormField={onUpdateField(orgUnit, programId)}
                onUpdateFormFieldAsync={onStartAsyncUpdateField(orgUnit, programId)}
                onSave={onSave(orgUnit)}
                onSaveAndCompleteEnrollment={onSaveAndCompleteEnrollment(orgUnit)}
                fieldOptions={this.fieldOptions}
                dataEntrySections={this.dataEntrySections}
                orgUnit={orgUnit}
                programId={programId}
                selectedOrgUnitId={orgUnit?.id}
                {...passOnProps}
            />
        );
    }

    render() {
        const { eventStatus } = this.props;
        const isScheduleOrOverdue = [statusTypes.SCHEDULE, statusTypes.OVERDUE].includes(eventStatus);

        return isScheduleOrOverdue ? this.renderScheduleView() : this.renderDataEntry();
    }
}

export const EditEventDataEntryComponent = withStyles(getStyles)(EditEventDataEntryPlain);
