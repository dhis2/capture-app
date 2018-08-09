// @flow
import * as React from 'react';
import log from 'loglevel';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

import { connect } from 'react-redux';

import i18n from '@dhis2/d2-i18n';

import Button from '../Buttons/Button.component';
import MultiButton from '../Buttons/MultiButton.component';
import ProgressButton from '../Buttons/ProgressButton.component';
import DataEntry from './DataEntry.component';
import errorCreator from '../../utils/errorCreator';

import { saveValidationFailed, saveAbort } from './actions/dataEntry.actions';
import getDataEntryKey from './common/getDataEntryKey';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';
import AsyncFieldHandler from './asyncFields/AsyncFieldHandler';

import { D2Form } from '../D2Form/D2Form.component';

type Props = {
    classes: Object,
    formFoundation: RenderFoundation,
    itemId: string,
    onSave: (itemId: string, id: string, formFoundation: RenderFoundation, saveType?: ?string) => void,
    onSaveAndAddAnother?: ?(itemId: string, id: string, formFoundation: RenderFoundation) => void,
    onSaveValidationFailed: (itemId: string, id: string) => void,
    onSaveAbort: (itemId: string, id: string) => void,
    saveAttempted?: ?boolean,
    id: string,
    warnings: ?Array<{id: string, warning: string }>,
    finalInProgress?: ?boolean,
};

type SaveType = {
    key: string,
    text: string,
}

type Options = {
    color?: ?string,
    saveTypes?: ?Array<SaveType>,
};

type OptionFn = (props: Props) => Options;

type State = {
    warningDialogOpen: boolean,
    waitForUploadDialogOpen: boolean,
    saveType?: ?string,
};

const getSaveButton = (InnerComponent: React.ComponentType<any>, optionFn: OptionFn) =>
    class SaveButtonBuilder extends React.Component<Props, State> {
        static errorMessages = {
            INNER_INSTANCE_NOT_FOUND: 'Inner instance not found',
            FORM_INSTANCE_NOT_FOUND: 'Form instance not found',
        };

        innerInstance: any;
        handleSaveAttempt: (saveType?: ?string) => void;
        handleCloseDialog: () => void;
        handleSaveDialog: () => void;
        constructor(props: Props) {
            super(props);
            this.handleSaveAttempt = this.handleSaveAttempt.bind(this);
            this.handleCloseDialog = this.handleCloseDialog.bind(this);
            this.handleSaveDialog = this.handleSaveDialog.bind(this);

            this.state = {
                warningDialogOpen: false,
                waitForUploadDialogOpen: false,
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

        getErrorInstance() {
            let currentInstance = this.innerInstance;
            let done;
            const dataEntryFields = [];
            while (!done) {
                currentInstance = currentInstance.getWrappedInstance && currentInstance.getWrappedInstance();
                if (!currentInstance || currentInstance instanceof DataEntry) {
                    done = true;
                } else if (currentInstance.constructor.name === 'ErrorWidgetBuilder') {
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

        showWarningsPopup(saveType?: ?string) {
            this.setState({ warningDialogOpen: true, saveType });
        }

        showWaitForUploadPopup = (saveType?: ?string) => {
            this.setState({ waitForUploadDialogOpen: true });
            AsyncFieldHandler.getDataEntryItemPromise(this.props.id, this.props.itemId).then(() => {
                this.setState({ waitForUploadDialogOpen: false });
                this.props.onSave(this.props.itemId, this.props.id, this.props.formFoundation, saveType);
            });
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

        handleSaveAttempt(saveType?: ?string) {
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

            this.handleSaveValidationOutcome(saveType, isFormValid);
        }

        handleSaveValidationOutcome(saveType?: ?string, isFormValid: boolean) {
            if (!isFormValid) {
                this.props.onSaveValidationFailed(this.props.itemId, this.props.id);
            } else if (this.props.warnings && this.props.warnings.length > 0) {
                this.showWarningsPopup(saveType);
            } else {
                this.handleSave(saveType);
            }
        }

        handleCloseDialog() {
            this.props.onSaveAbort(this.props.itemId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        handleSaveDialog() {
            this.handleSave(this.state.saveType);
            this.setState({ warningDialogOpen: false });
        }

        handleSave = (saveType?: ?string) => {
            if (AsyncFieldHandler.hasPromises(this.props.id, this.props.itemId)) {
                this.showWaitForUploadPopup(saveType);
            } else {
                this.props.onSave(this.props.itemId, this.props.id, this.props.formFoundation, saveType);
            }
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

        getDialogWaitForUploadContents = () => (
            <div>
                {i18n.t('Your data is uploading. Please wait untill this message disappears')}
            </div>
        );

        renderSingleSaveButton = (options: Options, saveType?: ?SaveType, finalInProgress?: ?boolean) => (
            <Tooltip title={!this.props.formFoundation.access.data.write ? i18n.t('No write access') : ''}>
                <ProgressButton
                    variant="raised"
                    color={options.color || 'primary'}
                    onClick={() => (saveType ? this.handleSaveAttempt(saveType.key) : this.handleSaveAttempt())}
                    disabled={!this.props.formFoundation.access.data.write}
                    inProgress={finalInProgress}
                >
                    {saveType ? saveType.text : i18n.t('Save')}
                </ProgressButton>

            </Tooltip>
        )

        renderMultiSaveButton = (options: Options, saveTypes: Array<SaveType>, finalInProgress?: ?boolean) => {
            const primary = saveTypes[0];
            const secondaries = saveTypes.slice(1).map(saveType => ({
                key: saveType.key,
                text: saveType.text,
                onClick: () => this.handleSaveAttempt(saveType.key),
            }));
            return (
                <Tooltip title={!this.props.formFoundation.access.data.write ? i18n.t('No write access') : ''}>
                    <MultiButton
                        variant="raised"
                        color={options.color || 'primary'}
                        buttonType="progress"
                        buttonText={primary.text}
                        disabled={!this.props.formFoundation.access.data.write}
                        buttonProps={{
                            onClick: () => this.handleSaveAttempt(saveTypes[0].key),
                            color: options.color || 'primary',
                            inProgress: finalInProgress,
                        }}
                        dropDownItems={secondaries}
                    />
                </Tooltip>

            );
        }


        render() {
            const {
                itemId,
                onSave,
                onSaveAndAddAnother,
                onSaveValidationFailed,
                onSaveAbort,
                finalInProgress,
                warnings,
                ...passOnProps
            } = this.props;
            const options = optionFn(this.props);

            if (!itemId) {
                return null;
            }

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        saveButton={!options.saveTypes || options.saveTypes.length < 1 ?
                            this.renderSingleSaveButton(options, options.saveTypes && options.saveTypes[0], finalInProgress) :
                            this.renderMultiSaveButton(options, options.saveTypes, finalInProgress)
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
                    <Dialog
                        open={this.state.waitForUploadDialogOpen}
                    >
                        <DialogTitle>
                            {i18n.t('Uploading data')}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {this.getDialogWaitForUploadContents()}
                            </DialogContentText>
                        </DialogContent>
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

export default (optionFn: OptionFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(getSaveButton(InnerComponent, optionFn));
