// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InfoIcon from '@material-ui/icons/InfoOutline';
import i18n from '@dhis2/d2-i18n';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withSaveButton from '../../../../components/DataEntry/withSaveButton';
import withCancelButton from '../../../../components/DataEntry/withCancelButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import { placements } from '../../../../components/DataEntry/dataEntryField/dataEntryField.const';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

import D2Date from '../../../../components/FormFields/DateAndTime/D2Date/D2Date.component';
import D2Coordinate from '../../../../components/FormFields/CoordinateField/CoordinateField.component';
import D2Polygon from '../../../../components/FormFields/PolygonField/PolygonField.component';
import D2TrueOnly from '../../../../components/FormFields/Generic/D2TrueOnly.component';
import withDefaultMessages from '../../../../components/DataEntry/dataEntryField/withDefaultMessages';
import withDefaultFieldContainer from '../../../../components/DataEntry/dataEntryField/withDefaultFieldContainer';
import withDefaultChangeHandler from '../../../../components/DataEntry/dataEntryField/withDefaultChangeHandler';
import withFeedbackOutput from '../../../../components/DataEntry/dataEntryOutput/withFeedbackOutput';
import withDefaultShouldUpdateInterface from
    '../../../../components/DataEntry/dataEntryField/withDefaultShouldUpdateInterface';

import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import TextEditor from '../../../FormFields/TextEditor/TextEditor.component';
import { newEventSaveTypes, newEventSaveTypeDefinitions } from './newEventSaveTypes';

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
});

const getSaveOptions = (props: Object) => {
    const options: {color?: ?string, saveTypes?: ?Array<any>} = {
        color: 'primary',
    };

    if (props.formHorizontal) {
        options.saveTypes = [
            newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDADDANOTHER],
            newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDEXIT],
        ];
        return options;
    }
    if (props.saveTypes) {
        options.saveTypes = props.saveTypes.map(saveType => newEventSaveTypeDefinitions[saveType]);
        return options;
    }

    options.saveTypes = [newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDEXIT], newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDADDANOTHER]];
    return options;
};

const getCancelOptions = () => ({
    color: 'primary',
});

const buildNoteSettingsFn = () => {
    const noteComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(TextEditor),
            ),
        ),
    );
    const noteSettings = (props: Object) => ({
        component: noteComponent,
        componentProps: {
            style: {
                width: '100%',
            },
            label: 'Comment',
        },
        propName: 'notes',
        hidden: props.formHorizontal,
        validatorContainers: [
        ],
        meta: {
            placement: placements.BOTTOM,
        },
    });
    return noteSettings;
};

const buildReportDateSettingsFn = () => {
    const reportDateComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(D2Date),
            ),
        ),
    );

    const reportDateSettings = (props: Object) => ({
        component: reportDateComponent,
        componentProps: {
            width: props && props.formHorizontal ? 150 : 350,
            calendarWidth: 350,
            label: props.formFoundation.getLabel('eventDate'),
            required: true,
        },
        propName: 'eventDate',
        validatorContainers: getEventDateValidatorContainers(),
    });

    return reportDateSettings;
};

const buildCoordinateSettingsFn = () => (props: Object) => {
    const type = props.formFoundation.featureType;

    if (type === 'POINT') {
        return {
            component: withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDefaultMessages()(
                        withDefaultChangeHandler()(D2Coordinate),
                    ),
                ),
            ),
            componentProps: {
                width: props && props.formHorizontal ? 150 : 350,
                label: 'Coordinate(s)',
                required: false,
            },
            propName: 'coordinate',
        };
    } else if (type === 'POLYGON') {
        return {
            component: withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withDefaultMessages()(
                        withDefaultChangeHandler()(D2Polygon),
                    ),
                ),
            ),
            componentProps: {
                width: props && props.formHorizontal ? 150 : 500,
                label: 'Location',
                required: false,
            },
            propName: 'coordinate',
        };
    }

    return {
        component: withDefaultFieldContainer()(
            withDefaultShouldUpdateInterface()(
                withDefaultMessages(),
            ),
        ),
        componentProps: {
            width: 0,
            label: 'Location',
            required: false,
        },
        propName: 'coordinate',
    };
};

const buildCompleteFieldSettingsFn = () => {
    const completeComponent = withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
            withDefaultMessages()(
                withDefaultChangeHandler()(D2TrueOnly),
            ),
        ),
    );

    const completeSettings = () => ({
        component: completeComponent,
        componentProps: {
            label: 'Complete event',
        },
        propName: 'complete',
        validatorContainers: [
        ],
        meta: {
            placement: placements.BOTTOM,
        },
    });

    return completeSettings;
};

const CommentField = withDataEntryField(buildNoteSettingsFn())(DataEntry);
const CoordinateField = withDataEntryField(buildCoordinateSettingsFn())(CommentField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(CoordinateField);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
const FeedbackOutput = withFeedbackOutput()(CompleteField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const SaveableDataEntry = withSaveButton(getSaveOptions)(ErrorOutput);
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    programName: string,
    orgUnitName: string,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSetSaveTypes: (saveTypes: ?Array<$Values<typeof newEventSaveTypes>>) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onSaveAndAddAnother: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onCancel: () => void,
    classes: {
        savingContextContainer: string,
        savingContextText: string,
        savingContextNames: string,
        topButtonsContainer: string,
        horizontalPaper: string,
    },
    theme: Theme,
    formHorizontal: ?boolean,
    saveTypes?: ?Array<$Values<typeof newEventSaveTypes>>
};

class NewEventDataEntry extends Component<Props> {
    fieldOptions: {theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = { theme: props.theme };
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

    renderVertical = () => this.renderContent();

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
            saveTypes,
        } = this.props;
        return (
            <div>
                <div>
                    <CancelableDataEntry
                        id={'singleEvent'}
                        formFoundation={formFoundation}
                        onUpdateFormField={onUpdateField}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField}
                        onCancel={onCancel}
                        onSave={this.handleSave}
                        formHorizontal={formHorizontal}
                        saveTypes={saveTypes}
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
