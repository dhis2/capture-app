// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withCancelButton from '../../../../components/DataEntry/withCancelButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import getNoteValidatorContainers from './fieldValidators/note.validatorContainersGetter';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import withDataEntryFieldIfApplicable from '../../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import withMainButton from './withMainButton';
import withFilterProps from '../../../FormFields/New/HOC/withFilterProps';
import withDataEntryNotesHandler from '../../../../components/DataEntry/dataEntryNotes/withDataEntryNotesHandler';
import Notes from '../../../Notes/Notes.component';

import {
    withSaveHandler,
    placements,
    withCleanUpHOC,
} from '../../../../components/DataEntry';
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
} from '../../../FormFields/New';

import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withFeedbackOutput from '../../../DataEntry/dataEntryOutput/withFeedbackOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import withBrowserBackWarning from '../../../DataEntry/withBrowserBackWarning';
import labelTypeClasses from './dataEntryFieldLabels.module.css';

const getStyles = (theme: Theme) => ({
    dataEntryContainer: {
        padding: theme.typography.pxToRem(8),
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
    COMMENTS: 'COMMENTS',
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
            label: props.formFoundation.getLabel('eventDate'),
            required: true,
        }),
        getPropName: () => 'eventDate',
        getValidatorContainers: () => getEventDateValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        }),
    };

    return reportDateSettings;
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
            label: 'Complete event',
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

const buildNotesSettingsFn = () => {
    const noteComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDisplayMessages()(
                        withInternalChangeHandler()(withDataEntryNotesHandler()(Notes)),
                    ),
                ),
            ),
        );
    const notesSettings = {
        getComponent: () => noteComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            id: 'comments',
            label: 'Comments',
            onAddNote: props.onAddNote,
            dataEntryId: props.id,
            readonly: !props.formFoundation.access.data.write,
        }),
        getPropName: () => 'note',
        getValidatorContainers: () => getNoteValidatorContainers(),
        getMeta: () => ({
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.COMMENTS,
        }),
    };

    return notesSettings;
};

const saveHandlerConfig = {
    onIsCompleting: (props: Object) => props.completeDataEntryFieldValue,
    onFilterProps: (props: Object) => {
        const { completeDataEntryFieldValue, ...passOnProps } = props;
        return passOnProps;
    },
};

const CleanUpHOC = withCleanUpHOC()(DataEntry);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CleanUpHOC);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(GeometryField);
const NotesField = withDataEntryField(buildNotesSettingsFn())(ReportDateField);
const FeedbackOutput = withFeedbackOutput()(NotesField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(ErrorOutput));
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);
const CompletableDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(CancelableDataEntry);
const DataEntryWrapper = withBrowserBackWarning()(CompletableDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onCancel: () => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    classes: {
        dataEntryContainer: string,
        fieldLabelMediaBased?: ?string,
    },
    theme: Theme,
};

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
    [dataEntrySectionNames.COMMENTS]: {
        placement: placements.BOTTOM,
        name: i18n.t('Comments'),
    },
};

class EditEventDataEntry extends Component<Props> {
    fieldOptions: { theme: Theme };
    dataEntrySections: { [$Values<typeof dataEntrySectionNames>]: DataEntrySection };
    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
    }
    componentWillUnmount() {
        inMemoryFileStore.clear();
    }
    render() {
        const {
            onUpdateField,
            onStartAsyncUpdateField,
            classes,
            ...passOnProps
        } = this.props;
        return (
            <div className={classes.dataEntryContainer}>
                <DataEntryWrapper
                    id={'singleEvent'}
                    onUpdateFormField={onUpdateField}
                    onUpdateFormFieldAsync={onStartAsyncUpdateField}
                    fieldOptions={this.fieldOptions}
                    dataEntrySections={this.dataEntrySections}
                    {...passOnProps}
                />
            </div>
        );
    }
}


export default withStyles(getStyles)(EditEventDataEntry);
