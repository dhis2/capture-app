// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { Component } from 'react';
import log from 'loglevel';
import { withStyles } from 'material-ui-next/styles';

import errorCreator from '../../utils/errorCreator';
import programCollection from '../../metaData/programCollection/programCollection';
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
    event: Event,
    completeButton?: ?React.Element<any>,
    saveButton?: ?React.Element<any>,
    eventFields?: ?Array<React.Element<any>>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    classes: Object,
    id: string
};

class DataEntry extends Component<Props> {
    static errorMessages = {
        NO_EVENT_SELECTED: 'No event selected',
    };

    formInstance: ?D2Form;

    constructor(props: Props) {
        super(props);
    }

    getWrappedInstance() {
        return this.formInstance;
    }

    getMetaDataStage() {
        const event = this.props.event;
        return getStageFromEvent(event);
    }

    render() {
        const { id, classes, event, completeButton, saveButton, completionAttempted, saveAttempted, eventFields, ...passOnProps } = this.props;

        if (!event) {
            return (
                <div>
                    {DataEntry.errorMessages.NO_EVENT_SELECTED}
                </div>
            );
        }

        const stageContainer = this.getMetaDataStage();
        if (stageContainer.error) {
            return (
                <div>
                    {stageContainer.error}
                </div>
            );
        }

        const stage = stageContainer.stage;

        return (
            <div>
                {eventFields}
                <D2Form
                    ref={(formInstance) => { this.formInstance = formInstance; }}
                    metaDataStage={stage}
                    dataId={event.eventId}
                    validationAttempted={completionAttempted || saveAttempted}
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
