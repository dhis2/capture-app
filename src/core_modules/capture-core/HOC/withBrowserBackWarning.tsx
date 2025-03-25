import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DiscardDialog } from '../components/Dialogs/DiscardDialog.component';

type Props = {
    dataEntryHasChanges: boolean;
    history: {
        block: (callback: (nextLocation: unknown, method: string) => boolean) => () => void;
        goBack: () => void;
    };
    inEffect: boolean;
    location: unknown;
    match: unknown;
    staticContext: unknown;
};

type State = {
    dialogOpen: boolean;
};

type DialogConfig = {
    header: string;
    text: string;
    destructiveText: string;
    cancelText: string;
};

const getEventListener = (InnerComponent: React.ComponentType<any>, dialogConfig: DialogConfig) =>
    class BrowserBackWarningForDataEntryHOC extends React.Component<Props, State> {
        private unblock: () => void;
        private Dialog: React.ReactElement<unknown>;
        private historyLength: number;

        constructor(props: Props) {
            super(props);
            this.state = {
                dialogOpen: false,
            };
        }

        componentDidMount(): void {
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

        componentWillUnmount(): void {
            this.unblock && this.unblock();
        }

        handleDialogConfirm = (): void => {
            this.setState({
                dialogOpen: false,
            });
            this.unblock();
            this.props.history.goBack();
        };

        handleDialogCancel = (): void => {
            this.setState({
                dialogOpen: false,
            });
        };

        render(): React.ReactNode {
            const { inEffect, history, location, match, staticContext, ...passOnProps } = this.props;
            return (
                <React.Fragment>
                    <InnerComponent
                        {...passOnProps}
                    />
                    <DiscardDialog
                        {...dialogConfig}
                        onDestroy={this.handleDialogConfirm}
                        open={this.state.dialogOpen}
                        onCancel={this.handleDialogCancel}
                    />
                </React.Fragment>
            );
        }
    };

type InEffectFn = (state: Record<string, unknown>, props: Record<string, unknown>) => boolean;

const getMapStateToProps = (inEffectFn: InEffectFn) => (state: Record<string, unknown>, props: { id: string }) => {
    const inEffect = inEffectFn(state, props);
    return {
        inEffect,
    };
};

const mapDispatchToProps = () => ({});

export const withBrowserBackWarning = (dialogConfig: DialogConfig, inEffect: InEffectFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(
            getMapStateToProps(inEffect),
            mapDispatchToProps
        )(withRouter(getEventListener(InnerComponent, dialogConfig)));
