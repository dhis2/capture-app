// @flow
import * as React from 'react';
import log from 'loglevel';

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
import i18n from '@dhis2/d2-i18n';
import { saveValidationFailed, saveAbort } from './actions/dataEntry.actions';
import getDataEntryKey from './common/getDataEntryKey';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

import { D2Form } from '../D2Form/D2Form.component';

type Props = {
    classes: Object,
    formFoundation: RenderFoundation,
    itemId: string,
    onSave: (itemId: string, id: string, formFoundation: RenderFoundation) => void,
    onSaveValidationFailed: (itemId: string, id: string) => void,
    onSaveAbort: (itemId: string, id: string) => void,
    saveAttempted?: ?boolean,
    id: string,
    warnings: ?Array<{id: string, warning: string }>,
    finalInProgress?: ?boolean,
};

type Options = {
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
                if (!currentInstance || currentInstance instanceof D2Form) {
                    done = true;
                }
            }
            return currentInstance;
        }

        getDataEntryFieldInstances() {
            let currentInstance = this.innerInstance;
            let done;
            const dataEntryFields = [];
            while (!done) {
                currentInstance = currentInstance.getWrappedInstance && currentInstance.getWrappedInstance();
                if (!currentInstance || currentInstance instanceof DataEntry) {
                    done = true;
                } else if (currentInstance.constructor.name === 'DataEntryFieldBuilder') {
                    dataEntryFields.push(currentInstance);
                }
            }
            return dataEntryFields;
        }

        validateDataEntryFields() {
            const fieldInstance = this.getDataEntryFieldInstances();

            let fieldsValid = true;
            let index = 0;
            while (fieldInstance[index] && fieldsValid) {
                fieldsValid = fieldInstance[index].validateAndScrollToIfFailed();
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
                        SaveButtonBuilder.errorMessages.FORM_INSTANCE_NOT_FOUND)({ SaveButtonBuilder: this }),
                );
                return {
                    error: true,
                    isValid: false,
                };
            }

            const isValid = formInstance.validateFormScrollToFirstFailedField();
            return {
                isValid,
                error: false,
            };
        }

        handleSaveAttempt() {
            if (!this.innerInstance) {
                log.error(
                    errorCreator(
                        SaveButtonBuilder.errorMessages.INNER_INSTANCE_NOT_FOUND)({ SaveButtonBuilder: this }));
                return;
            }

            const isDataEntryFieldsValid = this.validateDataEntryFields();
            if (!isDataEntryFieldsValid) {
                this.props.onSaveValidationFailed(this.props.itemId, this.props.id);
                return;
            }

            const { error: validateFormError, isValid: isFormValid } = this.validateForm();
            if (validateFormError) {
                return;
            }

            this.handleSaveValidationOutcome(isFormValid);
        }

        handleSaveValidationOutcome(isFormValid: boolean) {
            if (!isFormValid) {
                this.props.onSaveValidationFailed(this.props.itemId, this.props.id);
            } else if (this.props.warnings && this.props.warnings.length > 0) {
                this.showWarningsPopup();
            } else {
                this.props.onSave(this.props.itemId, this.props.id, this.props.formFoundation);
            }
        }

        handleCloseDialog() {
            this.props.onSaveAbort(this.props.itemId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        handleSaveDialog() {
            this.props.onSave(this.props.itemId, this.props.id, this.props.formFoundation);
            this.setState({ warningDialogOpen: false });
        }

        getDialogWarningContents() {
            if (this.state.warningDialogOpen) {
                const foundation = this.props.formFoundation;
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
                itemId,
                onSave,
                onSaveValidationFailed,
                onSaveAbort,
                finalInProgress,
                ...passOnProps
            } = this.props;
            const options = optionFn ? optionFn(this.props) : {};

            if (!itemId) {
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
                                { i18n.t('Save') }
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
                            <Button onClick={this.handleSaveDialog} color="primary" autoFocus>
                                {i18n.t('Save')}
                            </Button> </DialogActions>
                    </Dialog>
                </div>
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        itemId,
        saveAttempted:
            state.dataEntriesUI &&
            state.dataEntriesUI[key] &&
            state.dataEntriesUI[key].saveAttempted,
        warnings: state.rulesEffectsMessages[itemId] &&
            Object.keys(state.rulesEffectsMessages[itemId])
                .map((elementId) => {
                    const warning = state.rulesEffectsMessages[itemId][elementId] &&
                    (state.rulesEffectsMessages[itemId][elementId][messageStateKeys.WARNING] ||
                        state.rulesEffectsMessages[itemId][elementId][messageStateKeys.WARNING_ON_COMPLETE]);
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
    onSaveValidationFailed: (itemId: string, id: string) => {
        dispatch(saveValidationFailed(itemId, id));
    },
    onSaveAbort: (itemId: string, id: string) => {
        dispatch(saveAbort(itemId, id));
    },
});

export default (optionFn?: ?OptionFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getSaveButton(InnerComponent, optionFn));
