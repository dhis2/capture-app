// @flow
import * as React from 'react';
import { ensureState } from 'redux-optimistic-ui';
import log from 'loglevel';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui-next/Dialog';
import { connect } from 'react-redux';

import Button from '../Buttons/Button.component';
import ProgressButton from '../Buttons/ProgressButton.component';
import DataEntry from './DataEntry.component';
import errorCreator from '../../utils/errorCreator';
import { getTranslation } from '../../d2/d2Instance';
import { formatterOptions } from '../../utils/string/format.const';
import { startSaveEvent, saveValidationFailed, saveAbort } from './actions/dataEntry.actions';
import getDataEntryKey from './common/getDataEntryKey';

import getStageFromEvent from '../../metaData/helpers/getStageFromEvent';

import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

type Props = {
    classes: Object,
    eventId: string,
    event: Event,
    onSaveEvent: (eventId: string, id: string) => void,
    onSaveValidationFailed: (eventId: string, id: string) => void,
    onSaveAbort: (eventId: string, id: string) => void,
    saveAttempted?: ?boolean,
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

const getSaveButton = (InnerComponent: React.ComponentType<any>, optionFn?: ?OptionFn) =>
    class SaveButtonBuilder extends React.Component<Props, State> {
        static errorMessages = {
            INNER_INSTANCE_NOT_FOUND: 'Inner instance not found',
            FORM_INSTANCE_NOT_FOUND: 'Form instance not found',
        };

        innerInstance: any;
        handleSaveAttempt: () => void;
        handleCloseDialog: () => void;
        handleSaveDialog: () => void;
        constructor(props: Props) {
            super(props);
            this.handleSaveAttempt = this.handleSaveAttempt.bind(this);
            this.handleCloseDialog = this.handleCloseDialog.bind(this);
            this.handleSaveDialog = this.handleSaveDialog.bind(this);

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

        showWarningsPopup() {
            this.setState({ warningDialogOpen: true });
        }

        validateForm() {
            const formInstance = this.getFormInstance();
            if (!formInstance) {
                log.error(
                    errorCreator(
                        SaveButtonBuilder.errorMessages.FORM_INSTANCE_NOT_FOUND)({ CompleteButtonBuilder: this }),
                );
                return;
            }

            const valid = formInstance.validateFormScrollToFirstFailedField();
            if (!valid) {
                this.props.onSaveValidationFailed(this.props.eventId, this.props.id);
            } else if (this.props.warnings && this.props.warnings.length > 0) {
                this.showWarningsPopup();
            } else {
                this.props.onSaveEvent(this.props.eventId, this.props.id);
            }
        }

        handleSaveAttempt() {
            if (!this.innerInstance) {
                log.error(
                    errorCreator(
                        SaveButtonBuilder.errorMessages.INNER_INSTANCE_NOT_FOUND)({ SaveButtonBuilder: this }));
                return;
            }

            const isFieldsValid = this.validateEventFields();
            if (!isFieldsValid) {
                this.props.onSaveValidationFailed(this.props.eventId, this.props.id);
                return;
            }

            this.validateForm();
        }

        handleCloseDialog() {
            this.props.onSaveAbort(this.props.eventId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        handleSaveDialog() {
            this.props.onSaveEvent(this.props.eventId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        getFoundation() {
            const event = this.props.event;
            return getStageFromEvent(event);
        }

        getDialogWarningContents() {
            if (this.state.warningDialogOpen) {
                const foundationContainer = this.getFoundation();

                if (!foundationContainer || !foundationContainer.stage) {
                    return null;
                }

                const foundation = foundationContainer.stage;
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
                onSaveEvent,
                onSaveValidationFailed,
                onSaveAbort,
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
                        saveButton={
                            <ProgressButton
                                variant="raised"
                                onClick={this.handleSaveAttempt}
                                color={options.color || 'primary'}
                                inProgress={!!finalInProgress}
                            >
                                { getTranslation('save', formatterOptions.CAPITALIZE_FIRST_LETTER) }
                            </ProgressButton>
                        }
                        {...passOnProps}
                    />
                    <Dialog
                        open={this.state.warningDialogOpen}
                        onClose={this.handleCloseDialog}
                    >
                        <DialogTitle id="complete-dialog-title">
                            {getTranslation('warnings_found')}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {this.getDialogWarningContents()}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseDialog} color="primary">
                                {getTranslation('abort')}
                            </Button>
                            <Button onClick={this.handleSaveDialog} color="primary" autoFocus>
                                {getTranslation('save')}
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
        event: eventId && ensureState(state.events)[eventId],
        saveAttempted:
            state.dataEntriesUI &&
            state.dataEntriesUI[key] &&
            state.dataEntriesUI[key].saveAttempted,
        warnings: state.eventsRulesEffectsMessages[eventId] &&
            Object.keys(state.eventsRulesEffectsMessages[eventId])
                .map((elementId) => {
                    const warning = state.eventsRulesEffectsMessages[eventId][elementId] &&
                    (state.eventsRulesEffectsMessages[eventId][elementId][messageStateKeys.WARNING] ||
                        state.eventsRulesEffectsMessages[eventId][elementId][messageStateKeys.WARNING_ON_COMPLETE]);
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
    onSaveEvent: (eventId: string, id: string) => {
        dispatch(startSaveEvent(eventId, id));
    },
    onSaveValidationFailed: (eventId: string, id: string) => {
        dispatch(saveValidationFailed(eventId, id));
    },
    onSaveAbort: (eventId: string, id: string) => {
        dispatch(saveAbort(eventId, id));
    },
});

export default (optionFn?: ?OptionFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getSaveButton(InnerComponent, optionFn));
