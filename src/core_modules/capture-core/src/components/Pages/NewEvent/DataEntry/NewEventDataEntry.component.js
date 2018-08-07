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
import D2TrueOnly from '../../../../components/FormFields/Generic/D2TrueOnly.component';
import withDefaultMessages from '../../../../components/DataEntry/dataEntryField/withDefaultMessages';
import withDefaultFieldContainer from '../../../../components/DataEntry/dataEntryField/withDefaultFieldContainer';
import withDefaultChangeHandler from '../../../../components/DataEntry/dataEntryField/withDefaultChangeHandler';
import withFeedbackWidget from '../../../../components/DataEntry/dataEntryInfoWidgets/withFeedbackWidget';
import withDefaultShouldUpdateInterface from
    '../../../../components/DataEntry/dataEntryField/withDefaultShouldUpdateInterface';

import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorWidget from '../../../DataEntry/dataEntryInfoWidgets/withIndicatorWidget';
import withErrorWidget from '../../../DataEntry/dataEntryInfoWidgets/withErrorWidget';
import withWarningWidget from '../../../DataEntry/dataEntryInfoWidgets/withWarningWidget';
import TextEditor from '../../../FormFields/TextEditor/TextEditor.component';

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

const getSaveOptions = () => ({
    color: 'primary',
});

const getCancelOptions = () => ({
    color: 'secondary',
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
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(CommentField);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
const FeedbackWidget = withFeedbackWidget()(CompleteField);
const IndicatorWidget = withIndicatorWidget()(FeedbackWidget);
const WarningWidget = withWarningWidget()(IndicatorWidget);
const ErrorWidget = withErrorWidget()(WarningWidget);
const SaveableDataEntry = withSaveButton(getSaveOptions)(ErrorWidget);
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    programName: string,
    orgUnitName: string,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
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
};

class NewEventDataEntry extends Component<Props> {
    fieldOptions: {theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = { theme: props.theme };
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
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
            onSave,
            onCancel,
            programName, // eslint-disable-line
            orgUnitName, // eslint-disable-line
            classes,
            formHorizontal,
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
                        onSave={onSave}
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
