// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'; //eslint-disable-line

import ConfirmDialog from '../Dialogs/ConfirmDialog.component';
import getDataEntryKey from './common/getDataEntryKey';
import getDataEntryHasChanges from './common/dataEntryHasChanges';

type Props = {
    dataEntryHasChanges: boolean,
    history: Object,
};

type State = {
    dialogOpen: boolean,
};

const getEventListener = (InnerComponent: React.ComponentType<any>) =>
    class BeforeUnloadEventListenerForDataEntryHOC extends React.Component<Props, State> {
        unblock: () => void;
        constructor(props: Props) {
            super(props);
            this.state = {
                dialogOpen: false,
            };
        }

        componentDidMount() {
            const { history } = this.props;
            this.unblock = history.block((nextLocation, method) => {
                const { dataEntryHasChanges } = this.props;
                if (method === 'POP' && dataEntryHasChanges) {
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
        }

        handleDialogCancel = () => {
            this.setState({
                dialogOpen: false,
            });
        }

        render() {
            const { dataEntryHasChanges, history, ...passOnProps } = this.props;
            return (
                <React.Fragment>
                    <InnerComponent
                        {...passOnProps}
                    />
                    <ConfirmDialog
                        header={i18n.t('Discard event?')}
                        text={i18n.t('Leaving this page will discard the changes you made to this event.')}
                        confirmText={i18n.t('Discard')}
                        cancelText={i18n.t('Back to event')}
                        onConfirm={this.handleDialogConfirm}
                        open={this.state.dialogOpen}
                        onCancel={this.handleDialogCancel}
                    />
                </React.Fragment>
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    const dataEntryHasChanges = getDataEntryHasChanges(state, key);
    return {
        dataEntryHasChanges,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps)(withRouter(getEventListener(InnerComponent)));
