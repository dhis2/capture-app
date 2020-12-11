// @flow
import * as React from 'react';
import log from 'loglevel';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { validationStrategies } from '../../../metaData/RenderFoundation/renderFoundation.const';
import { saveValidationFailed, saveAbort } from '../actions/dataEntry.actions';
import getDataEntryKey from '../common/getDataEntryKey';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';
import { MessagesDialogContents } from './MessagesDialogContents';
import { makeGetWarnings, makeGetErrors } from './withSaveHandler.selectors';

type Props = {
  classes: Object,
  formFoundation: RenderFoundation,
  itemId: string,
  onSave: (
    itemId: string,
    id: string,
    formFoundation: RenderFoundation,
    saveType?: ?string,
  ) => void,
  onSaveValidationFailed: (itemId: string, id: string) => void,
  onSaveAbort: (itemId: string, id: string) => void,
  saveAttempted?: ?boolean,
  id: string,
  warnings: ?Array<any>,
  errors: ?Array<any>,
  hasGeneralErrors: ?boolean,
  inProgressList: Array<string>,
  calculatedFoundation: RenderFoundation,
};

type IsCompletingFn = (props: Props) => boolean;
type FilterPropsFn = (props: Object) => Object;
type GetFormFoundationFn = (props: Object) => RenderFoundation;

type State = {
  messagesDialogOpen: boolean,
  waitForPromisesDialogOpen: boolean,
  saveType?: ?string,
};

const getSaveHandler = (
  InnerComponent: React.ComponentType<any>,
  onIsCompleting?: IsCompletingFn,
  onFilterProps?: FilterPropsFn,
  onGetFormFoundation?: GetFormFoundationFn,
) => {
  class SaveHandlerHOC extends React.Component<Props, State> {
    formInstance: any;

    dataEntryFieldInstances: Map<string, any>;

    isCompleting: boolean;

    constructor(props: Props) {
      super(props);
      this.dataEntryFieldInstances = new Map();
      this.state = {
        messagesDialogOpen: false,
        waitForPromisesDialogOpen: false,
      };
    }

    componentDidUpdate(prevProps: Props) {
      if (
        this.state.waitForPromisesDialogOpen &&
        this.props.inProgressList.length === 0 &&
        prevProps.inProgressList.length > 0
      ) {
        this.validateAndSave(this.state.saveType);
        // todo (eslint)
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ waitForPromisesDialogOpen: false, saveType: null });
      }
    }

    static errorMessages = {
      INNER_INSTANCE_NOT_FOUND: 'Inner instance not found',
      FORM_INSTANCE_NOT_FOUND: 'Form instance not found',
    };

    getDataEntryFieldInstances() {
      // $FlowFixMe[missing-annot] automated comment
      return Array.from(this.dataEntryFieldInstances.entries()).map((entry) => entry[1]);
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

    showMessagesPopup(saveType?: ?string) {
      this.setState({ messagesDialogOpen: true, saveType });
    }

    validateGeneralErrorsFromRules(isCompleting: boolean) {
      const { validationStrategy } = this.props.calculatedFoundation;
      if (validationStrategy === validationStrategies.NONE) {
        return true;
      }
      if (validationStrategy === validationStrategies.ON_COMPLETE) {
        return isCompleting ? !this.props.hasGeneralErrors : true;
      }

      return !this.props.hasGeneralErrors;
    }

    validateForm() {
      const { formInstance } = this;
      if (!formInstance) {
        log.error(
          errorCreator(SaveHandlerHOC.errorMessages.FORM_INSTANCE_NOT_FOUND)({
            SaveButtonBuilder: this,
          }),
        );
        return {
          error: true,
          isValid: false,
        };
      }

      const isCompleting = !!(onIsCompleting && onIsCompleting(this.props));

      const isValid =
        formInstance.validateFormScrollToFirstFailedField({ isCompleting }) &&
        this.validateGeneralErrorsFromRules(isCompleting);

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
    };

    handleSaveValidationOutcome(saveType?: ?string, isFormValid: boolean) {
      const { onSaveValidationFailed, itemId, id, warnings, errors } = this.props;
      if (!isFormValid) {
        onSaveValidationFailed(itemId, id);
      } else if ((errors && errors.length > 0) || (warnings && warnings.length > 0)) {
        this.showMessagesPopup(saveType);
      } else {
        this.handleSave(saveType);
      }
    }

    handleAbortDialog = () => {
      this.props.onSaveAbort(this.props.itemId, this.props.id);
      this.setState({ messagesDialogOpen: false });
    };

    handleSaveDialog = () => {
      this.handleSave(this.state.saveType);
      this.setState({ messagesDialogOpen: false });
    };

    handleSave = (saveType?: ?string) => {
      const { onSave, itemId, id, calculatedFoundation } = this.props;
      onSave(itemId, id, calculatedFoundation, saveType);
    };

    getDialogWaitForUploadContents = () => (
      <div>{i18n.t('Some operations are still runnning. Please wait..')}</div>
    );

    // $FlowFixMe[missing-annot] automated comment
    setFormInstance = (formInstance) => {
      this.formInstance = formInstance;
    };

    // $FlowFixMe[missing-annot] automated comment
    setDataEntryFieldInstance = (dataEntryFieldInstance, id) => {
      this.dataEntryFieldInstances.set(id, dataEntryFieldInstance);
    };

    render() {
      const {
        itemId,
        onSave,
        onSaveValidationFailed,
        onSaveAbort,
        warnings,
        errors,
        hasGeneralErrors,
        inProgressList,
        calculatedFoundation,
        ...passOnProps
      } = this.props;

      if (!itemId) {
        return null;
      }

      const filteredProps = onFilterProps ? onFilterProps(passOnProps) : passOnProps;
      this.isCompleting = !!(onIsCompleting && onIsCompleting(this.props));

      return (
        <div>
          <InnerComponent
            formRef={this.setFormInstance}
            dataEntryFieldRef={this.setDataEntryFieldInstance}
            onSave={this.handleSaveAttempt}
            {...filteredProps}
          />
          <Dialog open={this.state.messagesDialogOpen} onClose={this.handleAbortDialog}>
            <MessagesDialogContents
              open={this.state.messagesDialogOpen}
              onAbort={this.handleAbortDialog}
              onSave={this.handleSaveDialog}
              errors={errors}
              warnings={warnings}
              isCompleting={this.isCompleting}
              validationStrategy={calculatedFoundation.validationStrategy}
            />
          </Dialog>
          <Dialog open={this.state.waitForPromisesDialogOpen}>
            <DialogTitle>{i18n.t('Operations running')}</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.getDialogWaitForUploadContents()}</DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  }

  const makeStateToProps = () => {
    const getWarnings = makeGetWarnings();
    const getErrors = makeGetErrors();

    const mapStateToProps = (
      state: ReduxState,
      props: { id: string, formFoundation: RenderFoundation },
    ) => {
      const itemId =
        state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
      const key = getDataEntryKey(props.id, itemId);
      const generalErrors =
        state.rulesEffectsGeneralErrors[key] && state.rulesEffectsGeneralErrors[key].error;
      const foundation = onGetFormFoundation ? onGetFormFoundation(props) : props.formFoundation;

      return {
        itemId,
        saveAttempted:
          state.dataEntriesUI && state.dataEntriesUI[key] && state.dataEntriesUI[key].saveAttempted,
        warnings: getWarnings(state, props, { key, foundation }),
        errors: getErrors(state, props, { key, foundation }),
        hasGeneralErrors: generalErrors && generalErrors.length > 0,
        inProgressList: state.dataEntriesInProgressList[key] || [],
        calculatedFoundation: foundation,
      };
    };

    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
  };

  const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSaveValidationFailed: (itemId: string, id: string) => {
      dispatch(saveValidationFailed(itemId, id));
    },
    onSaveAbort: (itemId: string, id: string) => {
      dispatch(saveAbort(itemId, id));
    },
  });

  // $FlowFixMe
  return connect(makeStateToProps, mapDispatchToProps)(SaveHandlerHOC);
};

export default (options?: {
  onIsCompleting?: IsCompletingFn,
  onFilterProps?: FilterPropsFn,
  onGetFormFoundation?: GetFormFoundationFn,
}) => (InnerComponent: React.ComponentType<any>) =>
  getSaveHandler(
    InnerComponent,
    options && options.onIsCompleting,
    options && options.onFilterProps,
    options && options.onGetFormFoundation,
  );
