// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import { getDataEntryKey } from './common/getDataEntryKey';
import { dataEntryHasChanges as getDataEntryHasChanges } from './common/dataEntryHasChanges';
import { defaultDialogProps } from '../Dialogs/DiscardDialog.constants';

type Props = {
    dataEntryHasChanges: boolean,
    history: Object,
};

type State = {
    dialogOpen: boolean,
};

const getEventListener = (InnerComponent: React.ComponentType<any>) =>
    class BrowserBackWarningForDataEntryHOC extends React.Component<Props, State> {
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
            // this.props.history.goBack();
        }

        handleDialogCancel = () => {
            this.setState({
                dialogOpen: false,
            });
        }

        render() {
            // $FlowFixMe[prop-missing] automated comment
            const { dataEntryHasChanges, history, location, match, staticContext, ...passOnProps } = this.props;
            return (
                <React.Fragment>
                    <InnerComponent
                        {...passOnProps}
                    />
                    <DiscardDialog
                        {...defaultDialogProps}
                        onDestroy={this.handleDialogConfirm}
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

export const withBrowserBackWarning = () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(
            // $FlowFixMe[missing-annot] automated comment
            mapStateToProps, mapDispatchToProps)(withRouter(getEventListener(InnerComponent)));
