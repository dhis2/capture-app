// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'; //eslint-disable-line
import ConfirmDialog from '../components/Dialogs/ConfirmDialog.component';

type Props = {
  dataEntryHasChanges: boolean,
  history: Object,
  inEffect: boolean,
  location: any,
  match: any,
  staticContext: any,
};

type State = {
  dialogOpen: boolean,
};

type DialogConfig = {
  header: string,
  text: string,
  confirmText: string,
  cancelText: string,
};

const getEventListener = (InnerComponent: React.ComponentType<any>, dialogConfig: DialogConfig) =>
  class BrowserBackWarningForDataEntryHOC extends React.Component<Props, State> {
    unblock: () => void;

    Dialog: React.Element<any>;

    historyLength: number;

    constructor(props: Props) {
      super(props);
      this.state = {
        dialogOpen: false,
      };
    }

    componentDidMount() {
      const { history } = this.props;
      this.historyLength = window.history.length;
      this.unblock = history.block((nextLocation, method) => {
        const { inEffect } = this.props;
        const isBack = window.history.length === this.historyLength;
        if (method === 'POP' && inEffect && isBack) {
          this.setState({
            dialogOpen: true,
          });
          return false;
        }
        return true;
      });
    }

    componentWillUnmount() {
      this.unblock && this.unblock();
    }

    handleDialogConfirm = () => {
      this.setState({
        dialogOpen: false,
      });
      this.unblock();
      this.props.history.goBack();
    };

    handleDialogCancel = () => {
      this.setState({
        dialogOpen: false,
      });
    };

    render() {
      const { inEffect, history, location, match, staticContext, ...passOnProps } = this.props;
      return (
        <>
          <InnerComponent {...passOnProps} />
          <ConfirmDialog
            {...dialogConfig}
            onConfirm={this.handleDialogConfirm}
            open={this.state.dialogOpen}
            onCancel={this.handleDialogCancel}
          />
        </>
      );
    }
  };

type InEffectFn = (state: ReduxState, props: Object) => boolean;

const getMapStateToProps = (inEffectFn: InEffectFn) => (
  state: ReduxState,
  props: { id: string },
) => {
  const inEffect = inEffectFn(state, props);
  return {
    inEffect,
  };
};

const mapDispatchToProps = () => ({});

export default (dialogConfig: DialogConfig, inEffect: InEffectFn) => (
  InnerComponent: React.ComponentType<any>,
) =>
  // $FlowFixMe[missing-annot] automated comment
  connect(
    getMapStateToProps(inEffect),
    mapDispatchToProps,
  // $FlowFixMe[missing-annot] automated comment
  )(withRouter(getEventListener(InnerComponent, dialogConfig)));
