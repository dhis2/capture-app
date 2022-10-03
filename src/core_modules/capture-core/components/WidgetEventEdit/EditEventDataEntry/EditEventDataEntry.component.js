// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TabBar, Tab } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import { getNoFutureEventDateValidatorContainers } from '../DataEntry/fieldValidators/eventDate.validatorContainersGetter';
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
} from '../../FormFields/New';
import { statusTypes } from '../../../events/statusTypes';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import labelTypeClasses from '../DataEntry/dataEntryFieldLabels.module.css';
import { withDeleteButton } from '../DataEntry/withDeleteButton';
import { actionTypes } from './editEventDataEntry.actions';

const tabMode = Object.freeze({
    REPORT: 'REPORT',
    SCHEDULE: 'SCHEDULE',
});

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
            calendarMaxMoment: moment(),
        }),
        getPropName: () => 'occurredAt',
        getValidatorContainers: () => getNoFutureEventDateValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
};

const buildScheduleDateSettingsFn = () => {
    const scheduleDateComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                            customTooltip: i18n.t('Go to “Schedule” tab to reschedule this event'),
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
        getComponent: () => scheduleDateComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            width: '100%',
            calendarWidth: 350,
            label: props.formFoundation.getLabel('scheduledAt'),
            disabled: true,
            calendarMaxMoment: moment(),
        }),
        getIsHidden: (props: Object) => ![statusTypes.SCHEDULE, statusTypes.OVERDUE].includes(props.eventStatus),
        getPropName: () => 'scheduledAt',
        getValidatorContainers: () => getNoFutureEventDateValidatorContainers(),
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
            });
        }
        return createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: i18n.t('Coordinate'),
            dialogLabel: i18n.t('Coordinate'),
            required: false,
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

const saveHandlerConfig = {
    onIsCompleting: (props: Object) => props.completeDataEntryFieldValue,
    onFilterProps: (props: Object) => {
        const { completeDataEntryFieldValue, ...passOnProps } = props;
        return passOnProps;
    },
};

const CleanUpHOC = withCleanUp()(DataEntry);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CleanUpHOC);
const ScheduleDateField = withDataEntryField(buildScheduleDateSettingsFn())(GeometryField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(ScheduleDateField);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(ReportDateField));
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);
const CompletableDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(CancelableDataEntry);
const DeletableDataEntry = withDeleteButton()(CompletableDataEntry);
const DataEntryWrapper = withBrowserBackWarning()(DeletableDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    orgUnit: OrgUnit,
    programId: string,
    initialScheduleDate?: string,
    onUpdateDataEntryField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void,
    onUpdateField: (orgUnit: OrgUnit, programId: string) => (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: (orgUnit: OrgUnit, programId: string) => void,
    onSave: (orgUnit: OrgUnit) => (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onHandleScheduleSave: (eventData: Object) => void,
    onDelete: () => void,
    onCancel: () => void,
    classes: {
        dataEntryContainer: string,
        fieldLabelMediaBased?: ?string,
    },
    theme: Theme,
    dataEntryId: string,
    onCancelEditEvent?: () => void,
    eventStatus?: string,
    enrollmentId?: string,
};

type State = {
    mode: string
}

type DataEntrySection = {
    placement: $Values<typeof placements>,
    name: string,
};

const dataEntrySectionDefinitions = {
    [dataEntrySectionNames.BASICINFO]: {
        placement: placements.TOP,
        name: i18n.t('Basic info'),
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

    componentWillUnmount() {
        inMemoryFileStore.clear();
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
            classes,
            ...passOnProps
        } = this.props;
        return ( // $FlowFixMe[cannot-spread-inexact] automated comment
            <DataEntryWrapper
                id={dataEntryId}
                onUpdateDataEntryField={onUpdateDataEntryField(orgUnit, programId)}
                onUpdateFormField={onUpdateField(orgUnit, programId)}
                onUpdateFormFieldAsync={onStartAsyncUpdateField(orgUnit, programId)}
                onSave={onSave(orgUnit)}
                fieldOptions={this.fieldOptions}
                dataEntrySections={this.dataEntrySections}
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
