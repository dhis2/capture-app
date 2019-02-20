// @flow
import * as React from 'react';
import log from 'loglevel';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { connect } from 'react-redux';

import i18n from '@dhis2/d2-i18n';

import Button from '../Buttons/Button.component';
import errorCreator from '../../utils/errorCreator';

import { validationStrategies } from '../../metaData/RenderFoundation/renderFoundation.const';
import { saveValidationFailed, saveAbort } from './actions/dataEntry.actions';
import getDataEntryKey from './common/getDataEntryKey';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { messageStateKeys } from '../../reducers/descriptions/rulesEffects.reducerDescription';

type Props = {
    classes: Object,
    formFoundation: RenderFoundation,
    itemId: string,
    onSave: (itemId: string, id: string, formFoundation: RenderFoundation, saveType?: ?string) => void,
    onSaveValidationFailed: (itemId: string, id: string) => void,
    onSaveAbort: (itemId: string, id: string) => void,
    saveAttempted?: ?boolean,
    id: string,
    warnings: ?Array<{id: string, warning: string }>,
    hasGeneralErrors: ?boolean,
    inProgressList: Array<string>,
};

type IsCompletingFn = (props: Props) => boolean;
type FilterPropsFn = (props: Object) => Object;
type GetFormFoundationFn = (props: Object) => RenderFoundation;

type State = {
    warningDialogOpen: boolean,
    waitForPromisesDialogOpen: boolean,
    saveType?: ?string,
};

const getSaveHandler = (
    InnerComponent: React.ComponentType<any>,
    onIsCompleting?: IsCompletingFn,
    onFilterProps?: FilterPropsFn,
    onGetFormFoundation?: GetFormFoundationFn) =>
    class SaveHandlerHOC extends React.Component<Props, State> {
        static errorMessages = {
            INNER_INSTANCE_NOT_FOUND: 'Inner instance not found',
            FORM_INSTANCE_NOT_FOUND: 'Form instance not found',
        };

        innerInstance: any;
        formInstance: any;
        dataEntryFieldInstances: Map<string, any>;
        handleSaveAttemptAsync: (saveType?: ?string) => void;
        handleCloseDialog: () => void;
        handleSaveDialog: () => void;
        constructor(props: Props) {
            super(props);
            this.dataEntryFieldInstances = new Map();
            this.state = {
                warningDialogOpen: false,
                waitForPromisesDialogOpen: false,
            };
        }

        componentDidUpdate(prevProps: Props) {
            if (this.state.waitForPromisesDialogOpen &&
                this.props.inProgressList.length === 0 &&
                prevProps.inProgressList.length > 0
            ) {
                this.validateAndSave(this.state.saveType);
                this.setState({ waitForPromisesDialogOpen: false, saveType: null });
            }
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        getDataEntryFieldInstances() {
            return Array.from(this.dataEntryFieldInstances.entries()).map(entry => entry[1]);
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

        validateGeneralErrorsFromRules(isCompleting: boolean) {
            const validationStrategy = onGetFormFoundation ?
                onGetFormFoundation(this.props).validationStrategy :
                this.props.formFoundation.validationStrategy;
            if (validationStrategy === validationStrategies.NONE) {
                return true;
            } else if (validationStrategy === validationStrategies.ON_COMPLETE) {
                return (isCompleting ? !this.props.hasGeneralErrors : true);
            }

            return !this.props.hasGeneralErrors;
        }

        validateForm() {
            const formInstance = this.formInstance;
            if (!formInstance) {
                log.error(
                    errorCreator(
                        SaveHandlerHOC.errorMessages.FORM_INSTANCE_NOT_FOUND)({ SaveButtonBuilder: this }),
                );
                return {
                    error: true,
                    isValid: false,
                };
            }

            const isCompleting = !!(onIsCompleting && onIsCompleting(this.props));

            const isValid =
                formInstance.validateFormScrollToFirstFailedField({ isCompleting })
                && this.validateGeneralErrorsFromRules(isCompleting);

            return {
                isValid,
                error: false,
            };
        }

        validateAndSave(saveType?: ?string) {
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

        handleSaveAttempt = (saveType?: ?string) => {
            if (this.props.inProgressList.length > 0) {
                this.setState({ waitForPromisesDialogOpen: true, saveType });
                return;
            }
            this.validateAndSave(saveType);
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

        handleCloseDialog = () => {
            this.props.onSaveAbort(this.props.itemId, this.props.id);
            this.setState({ warningDialogOpen: false });
        }

        handleSaveDialog = () => {
            this.handleSave(this.state.saveType);
            this.setState({ warningDialogOpen: false });
        }

        handleSave = (saveType?: ?string) => {
            this.props.onSave(
                this.props.itemId,
                this.props.id,
                onGetFormFoundation ? onGetFormFoundation(this.props) : this.props.formFoundation,
                saveType,
            );
        }

        getDialogWarningContents() {
            if (this.state.warningDialogOpen) {
                const foundation = onGetFormFoundation ? onGetFormFoundation(this.props) : this.props.formFoundation;
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
                {i18n.t('Some operations are still runnning. Please wait..')}
            </div>
        );

        setFormInstance = (formInstance) => {
            this.formInstance = formInstance;
        }

        setDataEntryFieldInstance = (dataEntryFieldInstance, id) => {
            this.dataEntryFieldInstances.set(id, dataEntryFieldInstance);
        }

        render() {
            const {
                itemId,
                onSave,
                onSaveValidationFailed,
                onSaveAbort,
                warnings,
                hasGeneralErrors,
                inProgressList,
                ...passOnProps
            } = this.props;

            if (!itemId) {
                return null;
            }

            const filteredProps = onFilterProps ? onFilterProps(passOnProps) : passOnProps;

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        formRef={this.setFormInstance}
                        dataEntryFieldRef={this.setDataEntryFieldInstance}
                        onSave={this.handleSaveAttempt}
                        {...filteredProps}
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
                        open={this.state.waitForPromisesDialogOpen}
                    >
                        <DialogTitle>
                            {i18n.t('Operations running')}
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
    const generalErrors = state.rulesEffectsGeneralErrors && state.rulesEffectsGeneralErrors[key];
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
        hasGeneralErrors: (generalErrors && generalErrors.length > 0),
        inProgressList: state.dataEntriesInProgressList[key] || [],
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

export default (
    options?: {
        onIsCompleting?: IsCompletingFn,
        onFilterProps?: FilterPropsFn,
        onGetFormFoundation?: GetFormFoundationFn }) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowFixMe
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(
            getSaveHandler(
                InnerComponent,
                options && options.onIsCompleting,
                options && options.onFilterProps,
                options && options.onGetFormFoundation,
            ),
        );
