import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import { getDataEntryKey } from './common/getDataEntryKey';
import { dataEntryHasChanges as getDataEntryHasChanges } from './common/dataEntryHasChanges';
import { defaultDialogProps } from '../Dialogs/DiscardDialog.constants';

type Props = {
    dataEntryHasChanges: boolean;
    history: Record<string, any>;
    location: any;
    match: any;
    staticContext: any;
};

type State = {
    dialogOpen: boolean;
};

const getEventListener = (InnerComponent: React.ComponentType<any>) =>
    class BrowserBackWarningForDataEntryHOC extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                dialogOpen: false,
            };
        }

        componentDidMount() {
            const { history } = this.props;
            this.unblock = history.block((nextLocation: any, method: string) => {
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
            if (this.unblock) {
                this.unblock();
            }
        }

        unblock!: () => void;

        handleDialogConfirm = () => {
            this.setState({
                dialogOpen: false,
            });
            this.unblock();
        }

        handleDialogCancel = () => {
            this.setState({
                dialogOpen: false,
            });
        }

        render() {
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

const mapStateToProps = (state: any, props: { id: string }) => {
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
        connect(mapStateToProps, mapDispatchToProps)(withRouter(getEventListener(InnerComponent))) as any;
