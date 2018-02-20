// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { Component } from 'react';
import log from 'loglevel';
import { withStyles } from 'material-ui-next/styles';

import errorCreator from '../../utils/errorCreator';
import getStageFromEvent from '../../metaData/helpers/getStageFromEvent';

import D2Form from '../D2Form/D2Form.component';

const styles = theme => ({
    footerBar: {
        padding: theme.spacing.unit,
        display: 'flex',
    },
    button: {
        paddingRight: theme.spacing.unit * 2,
    },
});

type Props = {
    id: string,
    event: Event,
    completeButton?: ?React.Element<any>,
    saveButton?: ?React.Element<any>,
    eventFields?: ?Array<React.Element<any>>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    classes: Object,
    onUpdateField: (value: any, uiState: Object, elementId: string, sectionId: string, formId: string, dataEntryId: string) => void,
};

class DataEntry extends Component<Props> {
    static errorMessages = {
        NO_EVENT_SELECTED: 'No event selected',
    };

    formInstance: ?D2Form;
    handleUpdateField: (value: any, uiState: Object, elementId: string, sectionId: string, formId: string) => void;

    constructor(props: Props) {
        super(props);
        this.handleUpdateField = this.handleUpdateField.bind(this);
    }

    getWrappedInstance() {
        return this.formInstance;
    }

    getFormFoundation() {
        const event = this.props.event;
        return getStageFromEvent(event);
    }

    handleUpdateField(...args) {
        this.props.onUpdateField(...args, this.props.id);
    }

    render() {
        const { id, classes, event, completeButton, saveButton, completionAttempted, saveAttempted, eventFields, onUpdateField, ...passOnProps } = this.props;

        if (!event) {
            return (
                <div>
                    {DataEntry.errorMessages.NO_EVENT_SELECTED}
                </div>
            );
        }

        const formFoundationContainer = this.getFormFoundation();
        if (formFoundationContainer.error) {
            return (
                <div>
                    {formFoundationContainer.error}
                </div>
            );
        }

        const foundation = formFoundationContainer.stage;

        return (
            <div>
                {eventFields}
                <D2Form
                    innerRef={(formInstance) => { this.formInstance = formInstance; }}
                    formFoundation={foundation}
                    id={event.eventId}
                    validationAttempted={completionAttempted || saveAttempted}
                    onUpdateField={this.handleUpdateField}
                    {...passOnProps}
                />
                <div
                    className={classes.footerBar}
                >
                    <div
                        className={classes.button}
                    >
                        { completeButton }
                    </div>
                    <div
                        className={classes.button}
                    >
                        { saveButton }
                    </div>
                </div>
            </div>
        );
    }
}

const StylesHOC = withStyles(styles)(DataEntry);

type ContainerProps = {

};

class DataEntryContainer extends Component<ContainerProps> {
    dataEntryInstance: DataEntry;

    getWrappedInstance() {
        return this.dataEntryInstance;
    }

    render() {
        return (
            <StylesHOC
                innerRef={(dataEntryInstance) => {
                    this.dataEntryInstance = dataEntryInstance;
                }}
                {...this.props}
            />
        );
    }
}

export default DataEntryContainer;
