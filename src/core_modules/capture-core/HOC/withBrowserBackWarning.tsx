import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'; //eslint-disable-line
import { DiscardDialog } from '../components/Dialogs/DiscardDialog.component';
import { useStageLabel } from '../metaData';

type Props = {
    dataEntryHasChanges?: boolean;
    history: any;
    inEffect: boolean;
    location: any;
    match: any;
    staticContext: any;
    eventLabel?: string;
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

type DialogConfigInput = DialogConfig | ((options: { event: string }) => DialogConfig);

const getEventListener = (InnerComponent: React.ComponentType<any>, dialogConfigInput: DialogConfigInput) =>
    class BrowserBackWarningForDataEntryHOC extends React.Component<Props, State> {
        unblock!: () => void;
        Dialog!: React.ReactElement<any>;
        historyLength!: number;

        constructor(props: Props) {
            super(props);
            this.state = {
                dialogOpen: false,
            };
        }

        componentDidMount() {
            const { history } = this.props;
            this.historyLength = window.history.length;
            this.unblock = history.block((nextLocation: any, method: string) => {
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
        }

        handleDialogCancel = () => {
            this.setState({
                dialogOpen: false,
            });
        }

        render() {
            const { inEffect, history, location, match, staticContext, eventLabel, ...passOnProps } = this.props;
            const event = eventLabel ?? i18n.t('event');
            const dialogConfig = typeof dialogConfigInput === 'function'
                ? dialogConfigInput({ event })
                : dialogConfigInput;
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

type InEffectFn = (state: any, props: any) => boolean;

const getMapStateToProps = (inEffectFn: InEffectFn) => (state: any, props: any) => {
    const inEffect = inEffectFn(state, props);
    return {
        inEffect,
    };
};

const mapDispatchToProps = () => ({});

const withEventLabel = (Component: React.ComponentType<any>) => (props: any) => {
    const eventLabel = useStageLabel('event') ?? i18n.t('event');
    return <Component {...props} eventLabel={eventLabel} />;
};

export const withBrowserBackWarning = (dialogConfig: DialogConfigInput, inEffect: InEffectFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        withEventLabel(connect(getMapStateToProps(inEffect), mapDispatchToProps)(
            withRouter(getEventListener(InnerComponent, dialogConfig)),
        ));
