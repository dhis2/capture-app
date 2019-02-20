// @flow
import * as React from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { connect } from 'react-redux';

import Button from '../Buttons/Button.component';
import ProgressButton from '../Buttons/ProgressButton.component';
import DataEntry from './DataEntry.component';
import errorCreator from '../../utils/errorCreator';

import { startCompleteEvent, completeValidationFailed, completeAbort } from './actions/dataEntry.actions';
import getDataEntryKey from './common/getDataEntryKey';

import getStageFromEvent from '../../metaData/helpers/getStageFromEvent';

import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

type Props = {
    classes: Object,
    eventId: string,
    event: CaptureClientEvent,
    onCompleteEvent: (eventId: string, id: string) => void,
    onCompleteValidationFailed: (eventId: string, id: string) => void,
    onCompleteAbort: (eventId: string, id: string) => void,
    completionAttempted?: ?boolean,
    id: string,
    warnings: ?Array<{id: string, warning: string }>,
    finalInProgress?: ?boolean,
};

type Options = {
    buttonStyle?: ?Object,
    color?: ?string,
};

type OptionFn = (props: Props) => Options;

type State = {
    warningDialogOpen: boolean,
};

const getCompleteButton = (InnerComponent: React.ComponentType<any>, optionFn?: ?OptionFn) =>
    class CompleteButtonBuilder extends React.Component<Props, State> {
        static errorMessages = {
            INNER_INSTANCE_NOT_FOUND: 'Inner instance not found',
            FORM_INSTANCE_NOT_FOUND: 'Form instance not found',
        };

        innerInstance: any;
        handleCompletionAttempt: () => void;
        handleCloseDialog: () => void;
        handleCompleteDialog: () => void;
        constructor(props: Props) {
            super(props);
            this.handleCompletionAttempt = this.handleCompletionAttempt.bind(this);
            this.handleCloseDialog = this.handleCloseDialog.bind(this);
            this.handleCompleteDialog = this.handleCompleteDialog.bind(this);

            this.state = {
                warningDialogOpen: false,
            };
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        getFormInstance() {
            let currentInstance = this.innerInstance;
            let done;
            while (!done) {
                currentInstance = currentInstance.getWrappedInstance && currentInstance.getWrappedInstance();
                if (!currentInstance || currentInstance.name === 'D2Form') {
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
                } else if (currentInstance.name === 'EventFieldBuilder') {
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

        showWarningsPopup() {
            this.setState({ warningDialogOpen: true });
        }

        validateForm() {
            const formInstance = this.getFormInstance();
            if (!formInstance) {
                log.error(
                    errorCreator(
                        CompleteButtonBuilder.errorMessages.FORM_INSTANCE_NOT_FOUND)({ CompleteButtonBuilder: this }),
                );
                return;
            }

            const valid = formInstance.validateFormScrollToFirstFailedField();
            if (!valid) {
                this.props.onCompleteValidationFailed(this.props.eventId, this.props.id);
            } else if (this.props.warnings && this.props.warnings.length > 0) {
                this.showWarningsPopup();
            } else {
                this.props.onCompleteEvent(this.props.eventId, this.props.id);
            }
        }

        handleCompletionAttempt() {
            if (!this.innerInstance) {
                log.error(
                    errorCreator(
                        CompleteButtonBuilder.errorMessages.INNER_INSTANCE_NOT_FOUND)({ CompleteButtonBuilder: this }));
                return;
            }

            const isFieldsValid = this.validateEventFields();
            if (!isFieldsValid) {
                this.props.onCompleteValidationFailed(this.props.eventId, this.props.id);
                return;
            }

            this.validateForm();
        }

        handleCloseDialog() {
            this.props.onCompleteAbort(this.props.eventId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        handleCompleteDialog() {
            this.props.onCompleteEvent(this.props.eventId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        getDialogWarningContents() {
            if (this.state.warningDialogOpen) {
                const stageContainer = getStageFromEvent(this.props.event);

                if (!stageContainer || !stageContainer.stage) {
                    return null;
                }

                const foundation = stageContainer.stage.stageForm;
                const warnings = this.props.warnings;

                return warnings ?
                    warnings
                        .map((warningData) => {
                            const element = foundation.getElement(warningData.id);
                            return (
                                <div>
                                    {element.formName}: {warningData.warning}
                                </div>
                            );
                        }) :
                    null;
            }
            return null;
        }

        render() {
            const {
                eventId,
                onCompleteEvent,
                onCompleteValidationFailed,
                onCompleteAbort,
                finalInProgress,
                ...passOnProps
            } = this.props;
            const options = optionFn ? optionFn(this.props) : {};

            if (!eventId) {
                return null;
            }

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        completeButton={
                            <ProgressButton
                                variant="raised"
                                onClick={this.handleCompletionAttempt}
                                color={options.color || 'primary'}
                                inProgress={!!finalInProgress}
                            >
                                { i18n.t('Complete') }
                            </ProgressButton>
                        }
                        {...passOnProps}
                    />

                    <Dialog
                        open={this.state.warningDialogOpen}
                        onClose={this.handleCloseDialog}
                    >
                        <DialogTitle id="complete-dialog-title">
                            {i18n.t('Warnings found')}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {this.getDialogWarningContents()}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseDialog} color="primary">
                                {i18n.t('Abort')}
                            </Button>
                            <Button onClick={this.handleCompleteDialog} color="primary" autoFocus>
                                {i18n.t('Complete')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const eventId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].eventId;
    const key = getDataEntryKey(props.id, eventId);

    return {
        eventId,
        event: eventId && state.events[eventId],
        completionAttempted:
            state.dataEntriesUI &&
            state.dataEntriesUI[key] &&
            state.dataEntriesUI[key].completionAttempted,
        warnings: state.rulesEffectsMessages[eventId] &&
            Object.keys(state.rulesEffectsMessages[eventId])
                .map((elementId) => {
                    const warning = state.rulesEffectsMessages[eventId][elementId] &&
                    (state.rulesEffectsMessages[eventId][elementId][messageStateKeys.WARNING] ||
                        state.rulesEffectsMessages[eventId][elementId][messageStateKeys.WARNING_ON_COMPLETE]);
                    return {
                        id: elementId,
                        warning,
                    };
                })
                .filter(element => element.warning),
        finalInProgress: state.dataEntriesUI[key] && state.dataEntriesUI[key].finalInProgress,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCompleteEvent: (eventId: string, id: string) => {
        dispatch(startCompleteEvent(eventId, id));
    },
    onCompleteValidationFailed: (eventId: string, id: string) => {
        dispatch(completeValidationFailed(eventId, id));
    },
    onCompleteAbort: (eventId: string, id: string) => {
        dispatch(completeAbort(eventId, id));
    },
});

export default (optionFn?: ?OptionFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getCompleteButton(InnerComponent, optionFn));
