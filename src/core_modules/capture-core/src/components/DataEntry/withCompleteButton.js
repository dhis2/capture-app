// @flow
import * as React from 'react';
import log from 'loglevel';
import Button from 'material-ui-next/Button';
import { connect } from 'react-redux';

import D2Form from '../D2Form/D2Form.component';
import errorCreator from '../../utils/errorCreator';
import { getTranslation } from '../../d2/d2Instance';
import { formatterOptions } from '../../utils/string/format.const';
import { startCompleteEvent, completeValidationFailed } from './actions/dataEntry.actions';

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
                if (!currentInstance || currentInstance instanceof D2Form) {
                    done = true;
                }
            }
            return currentInstance;
        }

        handleCompletionAttempt() {
            if (!this.innerInstance) {
                log.error(errorCreator(CompleteButtonBuilder.errorMessages.INNER_INSTANCE_NOT_FOUND)({ CompleteButtonBuilder: this }));
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

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    eventId: state.dataEntry && state.dataEntry[props.id] && state.dataEntry[props.id].eventId,
    completionAttempted: state.dataEntry && state.dataEntry[props.id] && state.dataEntry[props.id].completionAttempted,
});

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
