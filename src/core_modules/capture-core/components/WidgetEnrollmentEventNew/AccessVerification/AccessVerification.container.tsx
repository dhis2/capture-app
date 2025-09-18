import { connect } from 'react-redux';
import type { ComponentType } from 'react';
import {
    AccessVerificationComponent,
} from './AccessVerification.component';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { makeEventAccessSelector } from './accessVerification.selectors';
import type { ContainerProps } from './accessVerification.types';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';

const inEffect = (state: any, ownProps: any) =>
    dataEntryHasChanges(state, ownProps.widgetReducerName) || state.newEventPage.showAddRelationship;

const makeMapStateToProps = () => {
    const eventAccessSelector = makeEventAccessSelector();
    return (state: any, { program, stage }: any) => ({
        eventAccess: eventAccessSelector(state, { programId: program.id, stageId: stage.id }),
    });
};

const mapDispatchToProps = () => ({
});

const AccessVerificationWithConnect = connect(makeMapStateToProps, mapDispatchToProps)(AccessVerificationComponent as any);

export const AccessVerification: ComponentType<ContainerProps> = withBrowserBackWarning(
    defaultDialogProps,
    inEffect,
)(AccessVerificationWithConnect);
