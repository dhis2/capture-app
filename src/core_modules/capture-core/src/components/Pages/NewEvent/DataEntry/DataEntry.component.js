// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/InfoOutline';
import i18n from '@dhis2/d2-i18n';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withSaveHandler from '../../../../components/DataEntry/withSaveHandler';
import withCancelButton from '../../../../components/DataEntry/withCancelButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import withMainButton from './withMainButton';
import getNoteValidatorContainers from './fieldValidators/note.validatorContainersGetter';
import DataEntryNotes from '../../../DataEntry/DataEntryNotes.container';
import DataEntryRelationships from '../../../DataEntry/DataEntryRelationships.component';
import {
    placements,
    withCleanUpHOC,
} from '../../../DataEntry';
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
    withFilterProps,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    orientations,
} from '../../../FormFields/New';

import withFeedbackOutput from '../../../../components/DataEntry/dataEntryOutput/withFeedbackOutput';
import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import newEventSaveTypes from './newEventSaveTypes';
import labelTypeClasses from './dataEntryFieldLabels.mod.css';
import withDataEntryFieldIfApplicable from '../../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import withBrowserBackWarning from '../../../DataEntry/withBrowserBackWarning';

const getStyles = theme => ({
    savingContextContainer: {
        paddingTop: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.grey.dark,
        fontSize: theme.typography.pxToRem(13),
    },
    savingContextText: {
        paddingLeft: theme.typography.pxToRem(10),
    },
    savingContextNames: {
        fontWeight: 'bold',
    },
    topButtonsContainer: {
        display: 'flex',
        flexFlow: 'row-reverse',
    },
    horizontal: {
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(20),
        paddingBottom: theme.typography.pxToRem(15),
    },
    fieldLabelMediaBased: {
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
    dataEntryVerticalContainer: {
        padding: theme.typography.pxToRem(8),
    },
});

const dataEntrySectionNames = {
    BASICINFO: 'BASICINFO',
    STATUS: 'STATUS',
    COMMENTS: 'COMMENTS',
    RELATIONSHIPS: 'RELATIONSHIPS',
};

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const getCancelOptions = () => ({
    color: 'primary',
});

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

const buildReportDateSettingsFn = () => {
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
    const reportDateSettings = (props: Object) => ({
        component: reportDateComponent,
        componentProps: createComponentProps(props, {
            width: props && props.formHorizontal ? 150 : '100%',
            label: props.formFoundation.getLabel('eventDate'),
            required: true,
            calendarWidth: props.formHorizontal ? 250 : 350,
            popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
        }),
        propName: 'eventDate',
        validatorContainers: getEventDateValidatorContainers(),
        meta: {
            placement: placements.TOP,
            section: dataEntrySectionNames.BASICINFO,
        },
    });

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
                    onGetCustomFieldLabeClass: (props: Object) => `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
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


const buildGeometrySettingsFn = () => (props: Object) => {
    const featureType = props.formFoundation.featureType;
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
                section: dataEntrySectionNames.BASICINFO,
            },
        };
    }
    if (featureType === 'Point') {
        return {
            component: pointComponent,
            componentProps: createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: 'Coordinate',
                dialogLabel: 'Coordinate',
                required: false,
                orientation: getOrientation(props.formHorizontal),
                shrinkDisabled: props.formHorizontal,
            }),
            propName: 'geometry',
            validatorContainers: [
            ],
            meta: {
                placement: placements.TOP,
                section: dataEntrySectionNames.BASICINFO,
            },
        };
    }
    return null;
};

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
                                withInternalChangeHandler()(
                                    withFilterProps(defaultFilterProps)(TrueOnlyField),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const completeSettings = (props: Object) => ({
        component: completeComponent,
        componentProps: createComponentProps(props, {
            label: 'Complete event',
            id: 'complete',
        }),
        propName: 'complete',
        validatorContainers: [
        ],
        meta: {
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.STATUS,
        },
        passOnFieldData: true,
    });

    return completeSettings;
};

const buildNotesSettingsFn = () => {
    const noteComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDisplayMessages()(
                        withInternalChangeHandler()(
                            withFilterProps(defaultFilterProps)(DataEntryNotes),
                        ),
                    ),
                ),
            ),
        );
    const notesSettings = (props: Object) => ({
        component: noteComponent,
        componentProps: createComponentProps(props, {
            label: 'Comments',
            onAddNote: props.onAddNote,
            id: 'comments',
            dataEntryId: props.id,
        }),
        propName: 'note',
        validatorContainers: getNoteValidatorContainers(),
        meta: {
            placement: placements.BOTTOM,
            section: dataEntrySectionNames.COMMENTS,
        },
    });

    return notesSettings;
};

const buildRelationshipsSettingsFn = () => {
    const relationshipsComponent =
        withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withFilterProps(defaultFilterProps)(DataEntryRelationships),
            ),
        );
    const relationshipsSettings = (props: Object) => {
        const hasRelationships =
            props.stage &&
            props.stage.relationshipTypes &&
            props.stage.relationshipTypes.length > 0;

        return hasRelationships ? {
            component: relationshipsComponent,
            componentProps: createComponentProps(props, {
                id: 'relationship',
                dataEntryId: props.id,
                onAddRelationship: props.onAddRelationship,
                fromEntity: 'EVENT',
            }),
            validatorContainers: [
            ],
            propName: 'relationship',
            meta: {
                placement: placements.BOTTOM,
                section: dataEntrySectionNames.RELATIONSHIPS,
            },
        } : null;
    };

    return relationshipsSettings;
};

const saveHandlerConfig = {
    onIsCompleting: (props: Object) => props.completeDataEntryFieldValue,
    onFilterProps: (props: Object) => {
        const { completeDataEntryFieldValue, ...passOnProps } = props;
        return passOnProps;
    },
};

const dataEntryFilterProps = (props: Object) => {
    const { stage, ...passOnProps } = props;
    return passOnProps;
};

const CleanUpHOC = withCleanUpHOC()(DataEntry);
const RelationshipField = withDataEntryFieldIfApplicable(buildRelationshipsSettingsFn())(CleanUpHOC);
const CommentField = withDataEntryField(buildNotesSettingsFn())(RelationshipField);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CommentField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(GeometryField);
const FeedbackOutput = withFeedbackOutput()(ReportDateField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const CancelableDataEntry = withCancelButton(getCancelOptions)(ErrorOutput);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(CancelableDataEntry));
const CompletableDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(SaveableDataEntry);
const WrappedDataEntry = withBrowserBackWarning()(withFilterProps(dataEntryFilterProps)(CompletableDataEntry));

type Props = {
    formFoundation: RenderFoundation,
    programName: string,
    orgUnitName: string,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSetSaveTypes: (saveTypes: ?Array<$Values<typeof newEventSaveTypes>>) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onSaveAndAddAnother: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    onCancel: () => void,
    classes: {
        savingContextContainer: string,
        savingContextText: string,
        savingContextNames: string,
        topButtonsContainer: string,
        horizontalPaper: string,
        dataEntryVerticalContainer: string,
        fieldLabelMediaBased: string,
        horizontal: string,
    },
    theme: Theme,
    formHorizontal: ?boolean,
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
    [dataEntrySectionNames.RELATIONSHIPS]: {
        placement: placements.BOTTOM,
        name: i18n.t('Relationships'),
    },
};
class NewEventDataEntry extends Component<Props> {
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

    componentWillMount() {
        this.props.onSetSaveTypes(null);
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    handleSave = (itemId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: ?string) => {
        if (saveType === newEventSaveTypes.SAVEANDADDANOTHER) {
            if (!this.props.formHorizontal) {
                this.props.onSetSaveTypes([newEventSaveTypes.SAVEANDADDANOTHER, newEventSaveTypes.SAVEANDEXIT]);
            }
            this.props.onSaveAndAddAnother(itemId, dataEntryId, formFoundation);
        } else if (saveType === newEventSaveTypes.SAVEANDEXIT) {
            this.props.onSave(itemId, dataEntryId, formFoundation);
        }
    }

    getSavingText() {
        const { classes, orgUnitName, programName } = this.props;
        const firstPart = `${i18n.t('Saving to')} `;
        const secondPart = ` ${i18n.t('in')} `;

        return (
            <span>
                {firstPart}
                <span
                    className={classes.savingContextNames}
                >
                    {programName}
                </span>
                {secondPart}
                <span
                    className={classes.savingContextNames}
                >
                    {orgUnitName}
                </span>
            </span>
        );
    }
    renderHorizontal = () => {
        const classes = this.props.classes;
        return (
            <div
                className={classes.horizontal}
            >
                {this.renderContent()}
            </div>
        );
    }

    renderVertical = () => (<div className={this.props.classes.dataEntryVerticalContainer}>{this.renderContent()}</div>);

    renderContent = () => {
        const {
            onUpdateField,
            onStartAsyncUpdateField,
            programName, // eslint-disable-line
            orgUnitName, // eslint-disable-line
            classes,
            onSave,
            onSetSaveTypes,
            onSaveAndAddAnother,
            theme,
            ...passOnProps
        } = this.props;
        return (
            <div>
                <div>
                    <WrappedDataEntry
                        id={'singleEvent'}
                        onUpdateFormField={onUpdateField}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField}
                        onSave={this.handleSave}
                        fieldOptions={this.fieldOptions}
                        dataEntrySections={this.dataEntrySections}
                        {...passOnProps}
                    />
                </div>
                <div
                    className={classes.savingContextContainer}
                >
                    <InfoIcon />
                    <div
                        className={classes.savingContextText}
                    >
                        {this.getSavingText()}
                    </div>
                </div>
            </div>
        );
    }


    render() {
        return (
            <div>
                {this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical()}
            </div>
        );
    }
}


export default withStyles(getStyles)(withTheme()(NewEventDataEntry));
