import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import { getDataEntryKey } from './common/getDataEntryKey';
import { dataEntryHasChanges as getDataEntryHasChanges } from './common/dataEntryHasChanges';
import { getDiscardDialogProps } from '../Dialogs/DiscardDialog.constants';
import { useStageLabel } from '../../metaData';

type Props = {
    dataEntryHasChanges: boolean;
    history: Record<string, any>;
    location: any;
    match: any;
    staticContext: any;
    eventLabel?: string;
};

type State = {
    dialogOpen: boolean;
};

const getEventListener = (InnerComponent: React.ComponentType<any>) =>
    class BrowserBackWarningForDataEntryHOC extends React.Component<Props, State> {
        unblock!: () => void;
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
            const {
                dataEntryHasChanges,
                history,
                location,
                match,
                staticContext,
                eventLabel,
                ...passOnProps
            } = this.props;
            return (
                <React.Fragment>
                    <InnerComponent
                        {...passOnProps}
                    />
                    <DiscardDialog
                        {...getDiscardDialogProps({ event: eventLabel })}
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

const withEventLabel = (Component: React.ComponentType<any>) => (props: any) => {
    const eventLabel = useStageLabel('event') ?? i18n.t('event');
    return <Component {...props} eventLabel={eventLabel} />;
};

export const withBrowserBackWarning = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withEventLabel(connect(mapStateToProps, mapDispatchToProps)(
            withRouter(getEventListener(InnerComponent)),
        ));
