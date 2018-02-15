// @flow
import * as React from 'react';
import log from 'loglevel';
import Button from 'material-ui-next/Button';
import { connect } from 'react-redux';

import DataEntry from './DataEntry.component';
import errorCreator from '../../utils/errorCreator';
import { getTranslation } from '../../d2/d2Instance';
import { formatterOptions } from '../../utils/string/format.const';
import { startCompleteEvent, completeValidationFailed } from './actions/dataEntry.actions';
import getDataEntryKey from './common/getDataEntryKey';

type Props = {
    classes: Object,
    eventId: string,
    onCompleteEvent: (eventId: string, id: string) => void,
    onCompleteValidationFailed: (eventId: string, id: string) => void,
    completionAttempted?: ?boolean,
    id: string
};

type Options = {
    buttonStyle?: ?Object,
    color?: ?string,
};

type OptionFn = (props: Props) => Options;

const getCompleteButton = (InnerComponent: React.ComponentType<any>, optionFn?: ?OptionFn) =>
    class CompleteButtonBuilder extends React.Component<Props> {
        static errorMessages = {
            INNER_INSTANCE_NOT_FOUND: 'Inner instance not found',
            FORM_INSTANCE_NOT_FOUND: 'Form instance not found',
        };

        innerInstance: any;
        handleCompletionAttempt: () => void;
        constructor(props: Props) {
            super(props);
            this.handleCompletionAttempt = this.handleCompletionAttempt.bind(this);
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        getFormInstance() {
            let currentInstance = this.innerInstance;
            let done;
            while (!done) {
                currentInstance = currentInstance.getWrappedInstance && currentInstance.getWrappedInstance();
                if (!currentInstance || currentInstance.constructor.name === 'D2Form') {
                    done = true;
                }
            }
            return currentInstance;
        }

        getEventFieldInstances() {
            let currentInstance = this.innerInstance;
            let done;
            const eventFields = [];
            while (!done) {
                currentInstance = currentInstance.getWrappedInstance && currentInstance.getWrappedInstance();
                if (!currentInstance || currentInstance instanceof DataEntry) {
                    done = true;
                } else if (currentInstance.constructor.name === 'EventFieldBuilder') {
                    eventFields.push(currentInstance);
                }
            }
            return eventFields;
        }

        validateEventFields() {
            const eventFieldInstance = this.getEventFieldInstances();
            
            let fieldsValid = true;
            let index = 0;
            while (eventFieldInstance[index] && fieldsValid) {
                fieldsValid = eventFieldInstance[index].validateAndScrollToIfFailed();
                index += 1;
            }
            return fieldsValid;
        }

        handleCompletionAttempt() {
            if (!this.innerInstance) {
                log.error(errorCreator(CompleteButtonBuilder.errorMessages.INNER_INSTANCE_NOT_FOUND)({ CompleteButtonBuilder: this }));
                return;
            }

            const isFieldsValid = this.validateEventFields();
            if (!isFieldsValid) {
                this.props.onCompleteValidationFailed(this.props.eventId, this.props.id);
                return;
            }

            const formInstance = this.getFormInstance();
            if (!formInstance) {
                log.error(errorCreator(CompleteButtonBuilder.errorMessages.FORM_INSTANCE_NOT_FOUND)({ CompleteButtonBuilder: this }));
                return;
            }

            const valid = formInstance.validateFormScrollToFirstFailedField();
            if (valid) {
                this.props.onCompleteEvent(this.props.eventId, this.props.id);
            } else {
                this.props.onCompleteValidationFailed(this.props.eventId, this.props.id);
            }
        }

        render() {
            const { eventId, onCompleteEvent, onCompleteValidationFailed, ...passOnProps } = this.props;
            const options = optionFn ? optionFn(this.props) : {};

            if (!eventId) {
                return null;
            }

            return (
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    completeButton={
                        <Button
                            raised
                            onClick={this.handleCompletionAttempt}
                            color={options.color || 'primary'}
                        >
                            { getTranslation('complete', formatterOptions.CAPITALIZE_FIRST_LETTER) }
                        </Button>
                    }
                    {...passOnProps}
                />

            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const eventId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].eventId;
    const key = getDataEntryKey(props.id, eventId);
    return {
        eventId,
        completionAttempted: state.dataEntriesUI && state.dataEntriesUI[key] && state.dataEntriesUI[key].completionAttempted,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCompleteEvent: (eventId: string, id: string) => {
        dispatch(startCompleteEvent(eventId, id));
    },
    onCompleteValidationFailed: (eventId: string, id: string) => {
        dispatch(completeValidationFailed(eventId, id));
    },
});

export default (optionFn?: ?OptionFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(getCompleteButton(InnerComponent, optionFn));
