import React, { Component } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { dataEntryIds } from 'capture-core/constants';
import { TabBar, Tab } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getEventDateValidatorContainers } from '../DataEntry/fieldValidators/eventDate.validatorContainersGetter';
import { withMainButton } from '../DataEntry/withMainButton';
import type { RenderFoundation } from '../../../metaData';
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
    SingleOrgUnitSelectField,
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
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import { getOrgUnitValidatorContainers } from '../DataEntry/fieldValidators';
import type { UserFormField } from '../../FormFields/UserField';
import type { ReduxAction } from '../../../../capture-core-utils/types';

const tabMode = Object.freeze({
    REPORT: 'REPORT',
    SCHEDULE: 'SCHEDULE',
});

const getStyles = (theme: any): Readonly<any> => ({
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

function defaultFilterProps(props: any) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getCancelOptions = () => ({
    color: 'primary',
});

const getBaseComponentProps = (props: any) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: any, componentProps: any) => ({
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
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
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
        getComponentProps: (props: any) => createComponentProps(props, {
            width: '100%',
            calendarWidth: 350,
            label: props.formFoundation.getLabel('occurredAt'),
            required: true,
            calendarType: systemSettingsStore.get().calendar,
            dateFormat: systemSettingsStore.get().dateFormat,
        }),
        getPropName: () => 'occurredAt',
        getValidatorContainers: (props: Record<string, unknown>) => getEventDateValidatorContainers(props),
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
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
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
        getComponent: (props: any) => scheduleDateComponent(props),
        getComponentProps: (props: any) => createComponentProps(props, {
            width: '100%',
            calendarWidth: 350,
            label: props.formFoundation.getLabel('scheduledAt'),
            disabled: true,
            required: false,
            calendarType: systemSettingsStore.get().calendar,
            dateFormat: systemSettingsStore.get().dateFormat,
        }),
        getIsHidden: (props: any) => props.id !== dataEntryIds.ENROLLMENT_EVENT || props.hideDueDate,
        getPropName: () => 'scheduledAt',
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return scheduleDateSettings;
};

const buildOrgUnitSettingsFn = () => {
    const orgUnitComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(SingleOrgUnitSelectField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );

    const orgUnitSettings = {
        getComponent: () => orgUnitComponent,
        getComponentProps: (props: any) => createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : 350,
            label: i18n.t('Organisation unit'),
            required: true,
        }),
        getPropName: () => 'orgUnit',
        getValidatorContainers: () => getOrgUnitValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return orgUnitSettings;
};


const pointComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withLabel({
                    onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: any) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
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
                    onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                    onGetCustomFieldLabeClass: (props: any) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
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
    isApplicable: (props: any) => {
        const featureType = props.formFoundation.featureType;
        return ['Polygon', 'Point'].includes(featureType);
    },
    getComponent: (props: any) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return polygonComponent;
        }
        return pointComponent;
    },
    getComponentProps: (props: any) => {
        const featureType = props.formFoundation.featureType;
        if (featureType === 'Polygon') {
            return createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: i18n.t('Area'),
                dialogLabel: i18n.t('Area'),
                required: false,
                orgUnitId: props.orgUnitIdFieldValue,
            });
        }
        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
            orgUnitId: props.orgUnitIdFieldValue,
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
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
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
        getComponentProps: (props: any) => createComponentProps(props, {
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
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
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
        getComponentProps: (props: any, fieldId: string) => createComponentProps(props, {
            ...props.categories?.find(category => category.id === fieldId) ?? {},
            required: true,
        }),
        getPropName: (props: any, fieldId?: string) => (fieldId ? `${attributeOptionsKey}-${fieldId}` : attributeOptionsKey),
        getFieldIds: (props: any) => props.categories?.map(category => category.id),
        getValidatorContainers: (props: any, fieldId?: string) => getCategoryOptionsValidatorContainers(props, fieldId),
        getMeta: (props: any) => ({
            section: AOCsectionKey,
            placement: placements.TOP,
            sectionName: props.programCategory?.displayName,
        }),
    };

    return categoryOptionsSettings;
};

const saveHandlerConfig = {
    onIsCompleting: (props: any) => props.completeDataEntryFieldValue === 'true',
    onFilterProps: (props: any) => {
        const { completeDataEntryFieldValue, ...passOnProps } = props;
        return passOnProps;
    },
};

const AOCFieldBuilderHOC = withAOCFieldBuilder({})(withDataEntryFields(getCategoryOptionsSettingsFn())(DataEntry));
const CleanUpHOC = withCleanUp()(AOCFieldBuilderHOC);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CleanUpHOC);
const OrgUnitField = withDataEntryField(buildOrgUnitSettingsFn())(GeometryField);
const ScheduleDateField = withDataEntryField(buildScheduleDateSettingsFn())(OrgUnitField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(ScheduleDateField);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(ReportDateField));
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);
const CompletableDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(CancelableDataEntry);
const DeletableDataEntry = withDeleteButton()(CompletableDataEntry);
const AskToCreateNewDataEntry = withAskToCreateNew()(DeletableDataEntry);
const AskToCompleteEnrollment = withAskToCompleteEnrollment()(AskToCreateNewDataEntry);
const DataEntryWrapper = withBrowserBackWarning()(AskToCompleteEnrollment);


type Props = {
    formFoundation?: RenderFoundation | null;
    orgUnit: OrgUnit;
    programId: string;
    itemId: string;
    initialScheduleDate?: string;
    onUpdateDataEntryField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void;
    onUpdateField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void;
    onStartAsyncUpdateField: (orgUnit: OrgUnit, programId: string) => void;
    onSave: (orgUnit: OrgUnit) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void;
    onSaveAndCompleteEnrollment: (
        orgUnit: OrgUnit,
    ) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void;
    onHandleScheduleSave: (eventData: any) => void;
    onDelete: () => void;
    onCancel: () => void;
    onConfirmCreateNew: (itemId: string) => void;
    onCancelCreateNew: (itemId: string) => void;
    theme: any,
    dataEntryId: string;
    onCancelEditEvent?: (isScheduled: boolean) => void;
    eventStatus?: string;
    enrollmentId: string;
    isCompleted?: boolean;
    assignee?: UserFormField | null;
    orgUnitFieldValue?: OrgUnit | null;
    stageId: string;
    eventData: any;
    enrolledAt: string;
    occurredAt: string;
    teiId: string;

};

type DataEntrySection = {
    placement: string;
    name?: string;
};

type State = {
    mode: string;
};

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

class EditEventDataEntryPlain extends Component<Props & WithStyles<typeof getStyles>, State> {
    fieldOptions: { theme: any; fieldLabelMediaBasedClass: string };
    dataEntrySections: { [key: string]: DataEntrySection };
    constructor(props: Props & WithStyles<typeof getStyles>) {
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
                {this.state.mode === tabMode.SCHEDULE &&
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
            orgUnitFieldValue,
            onUpdateDataEntryField,
            onUpdateField,
            onStartAsyncUpdateField,
            onSave,
            onSaveAndCompleteEnrollment,
            classes,
            ...passOnProps
        } = this.props;
        return (
            <DataEntryWrapper
                id={dataEntryId}
                onUpdateDataEntryField={onUpdateDataEntryField(orgUnit, programId)}
                onUpdateFormField={onUpdateField(orgUnit, programId)}
                onUpdateFormFieldAsync={onStartAsyncUpdateField(orgUnit, programId)}
                onSave={onSave(orgUnit)}
                onSaveAndCompleteEnrollment={onSaveAndCompleteEnrollment(orgUnit)}
                fieldOptions={this.fieldOptions}
                dataEntrySections={this.dataEntrySections}
                orgUnitIdFieldValue={orgUnitFieldValue?.id}
                orgUnit={orgUnit}
                orgUnitId={orgUnit?.id}
                programId={programId}
                selectedOrgUnitId={orgUnit?.id}
                {...passOnProps}
            />
        );
    }

    render() {
        const { eventStatus } = this.props;
        const isScheduleOrOverdue = eventStatus && [statusTypes.SCHEDULE, statusTypes.OVERDUE].includes(eventStatus);

        return isScheduleOrOverdue ? this.renderScheduleView() : this.renderDataEntry();
    }
}

export const EditEventDataEntryComponent = withStyles(getStyles)(EditEventDataEntryPlain);
