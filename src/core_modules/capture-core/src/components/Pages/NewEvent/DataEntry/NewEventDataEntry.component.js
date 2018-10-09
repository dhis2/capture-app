// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InfoIcon from '@material-ui/icons/InfoOutline';
import i18n from '@dhis2/d2-i18n';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withSaveHandler from '../../../../components/DataEntry/withSaveHandler';
import withCancelButton from '../../../../components/DataEntry/withCancelButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import { placements } from '../../../../components/DataEntry/dataEntryField/dataEntryField.const';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import withMainButton from './withMainButton';
import getNoteValidatorContainers from './fieldValidators/note.validatorContainersGetter';
import DataEntryNotes from '../../../DataEntry/DataEntryNotes.container';

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
} from '../../../FormFields/New';

import withDefaultFieldContainer from '../../../D2Form/field/withDefaultFieldContainer';
import withFeedbackOutput from '../../../../components/DataEntry/dataEntryOutput/withFeedbackOutput';
import withDefaultShouldUpdateInterface from
    '../../../D2Form/field/withDefaultShouldUpdateInterface';

import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import newEventSaveTypes from './newEventSaveTypes';
import labelTypeClasses from './dataEntryFieldLabels.mod.css';
import withDataEntryFieldIfApplicable from '../../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';

const getStyles = theme => ({
    savingContextContainer: {
        paddingTop: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.hint,
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
    horizontalPaper: {
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(20),
        paddingBottom: theme.typography.pxToRem(15),
    },
    fieldLabelMediaBased: {
        [theme.breakpoints.down(481)]: {
            paddingTop: '0px !important',
        },
    },
    dataEntryVerticalContainer: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: theme.typography.pxToRem(2),
        padding: theme.typography.pxToRem(20),
    },
});

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
            width: props && props.formHorizontal ? 150 : 350,
            calendarWidth: 350,
            label: props.formFoundation.getLabel('eventDate'),
            required: true,
        }),
        propName: 'eventDate',
        validatorContainers: getEventDateValidatorContainers(),
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


const buildGeometrySettingsFn = () => (props: Object) => {
    const featureType = props.formFoundation.featureType;
    if (featureType === 'Polygon') {
        return {
            component: polygonComponent,
            componentProps: createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: 'Location',
                required: false,
            }),
            propName: 'geometry',
            validatorContainers: [
            ],
            meta: {
                placement: placements.TOP,
            },
        };
    }
    if (featureType === 'Point') {
        return {
            component: pointComponent,
            componentProps: createComponentProps(props, {
                width: props && props.formHorizontal ? 150 : 350,
                label: 'Coordinate',
                required: false,
            }),
            propName: 'geometry',
            validatorContainers: [
            ],
            meta: {
                placement: placements.TOP,
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
        }),
        propName: 'complete',
        validatorContainers: [
        ],
        meta: {
            placement: placements.BOTTOM,
        },
    });

    return completeSettings;
};

const buildNotesSettingsFn = () => {
    const noteComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withLabel({
                        onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: Object) =>
                            `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(DataEntryNotes),
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
            id: props.id,
        }),
        propName: 'note',
        validatorContainers: getNoteValidatorContainers(),
        meta: {
            placement: placements.BOTTOM,
        },
    });

    return notesSettings;
};

const CommentField = withDataEntryField(buildNotesSettingsFn())(DataEntry);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CommentField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(GeometryField);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
const FeedbackOutput = withFeedbackOutput()(CompleteField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const CancelableDataEntry = withCancelButton(getCancelOptions)(ErrorOutput);
const SaveableDataEntry = withSaveHandler()(withMainButton()(CancelableDataEntry));

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
    },
    theme: Theme,
    formHorizontal: ?boolean,
};

class NewEventDataEntry extends Component<Props> {
    fieldOptions: { theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
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
            <Paper
                className={classes.horizontalPaper}
            >
                {this.renderContent()}
            </Paper>
        );
    }

    renderVertical = () => (<div className={this.props.classes.dataEntryVerticalContainer}>{this.renderContent()}</div>);

    renderContent = () => {
        const {
            formFoundation,
            onUpdateField,
            onStartAsyncUpdateField,
            onCancel,
            programName, // eslint-disable-line
            orgUnitName, // eslint-disable-line
            classes,
            formHorizontal,
            onAddNote,
        } = this.props;
        return (
            <div>
                <div>
                    <SaveableDataEntry
                        id={'singleEvent'}
                        formFoundation={formFoundation}
                        onUpdateFormField={onUpdateField}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField}
                        onCancel={onCancel}
                        onSave={this.handleSave}
                        onAddNote={onAddNote}
                        formHorizontal={formHorizontal}
                        fieldOptions={this.fieldOptions}
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
        return this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical();
    }
}


export default withStyles(getStyles)(withTheme()(NewEventDataEntry));
