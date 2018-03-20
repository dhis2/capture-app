// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { withStyles } from 'material-ui-next/styles';

import getStageFromEvent from '../../metaData/helpers/getStageFromEvent';
import D2Form from '../D2Form/D2Form.component';
import { placements } from './eventField/eventField.const';

const styles = theme => ({
    footerBar: {
        display: 'flex',
    },
    button: {
        paddingRight: theme.spacing.unit * 2,
    },
});

type FieldContainer = {
    field: React.Element<any>,
    placement: $Values<typeof placements>,
};

type Props = {
    id: string,
    event: Event,
    completeButton?: ?React.Element<any>,
    saveButton?: ?React.Element<any>,
    fields?: ?Array<FieldContainer>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    classes: Object,
    onUpdateField: (
        value: any,
        uiState: Object,
        elementId: string,
        sectionId: string,
        formId: string,
        dataEntryId: string) => void,
};

class DataEntry extends React.Component<Props> {
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
        this.props.onUpdateField(...args, this.props.id, this.props.event.eventId);
    }

    getFieldWithPlacement(placement: $Values<typeof placements>) {
        const fields = this.props.fields;

        return fields ?
            fields
                .filter(fieldContainer => fieldContainer.placement === placement)
                .map(fieldContainer => fieldContainer.field)
            : null;
    }

    render() {
        const {
            id,
            classes,
            event,
            completeButton,
            saveButton,
            completionAttempted,
            saveAttempted,
            fields,
            onUpdateField,
            ...passOnProps } = this.props;

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
        const topFields = this.getFieldWithPlacement(placements.TOP);
        const bottomFields = this.getFieldWithPlacement(placements.BOTTOM);

        return (
            <div>
                {topFields}
                <D2Form
                    innerRef={(formInstance) => { this.formInstance = formInstance; }}
                    formFoundation={foundation}
                    id={event.eventId}
                    validationAttempted={completionAttempted || saveAttempted}
                    onUpdateField={this.handleUpdateField}
                    {...passOnProps}
                />
                {bottomFields}
                <div
                    className={classes.footerBar}
                >
                    {
                        (() => {
                            if (completeButton) {
                                return (
                                    <div
                                        className={classes.button}
                                    >
                                        { completeButton }
                                    </div>
                                );
                            }
                            return null;
                        })()
                    }

                    {
                        (() => {
                            if (saveButton) {
                                return (
                                    <div
                                        className={classes.button}
                                    >
                                        { saveButton }
                                    </div>
                                );
                            }
                            return null;
                        })()
                    }
                </div>
            </div>
        );
    }
}

const StylesHOC = withStyles(styles)(DataEntry);

type ContainerProps = {

};

class DataEntryContainer extends React.Component<ContainerProps> {
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
