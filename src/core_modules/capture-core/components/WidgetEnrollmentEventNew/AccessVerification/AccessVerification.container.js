// @flow
import { connect } from 'react-redux';
import { type ComponentType } from 'react';
import { compose } from 'redux';
import {
    AccessVerificationComponent,
} from './AccessVerification.component';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { makeEventAccessSelector } from './accessVerification.selectors';
import type { ContainerProps } from './accessVerification.types';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';

const inEffect = (state: ReduxState, ownProps) =>
    dataEntryHasChanges(state, ownProps.widgetReducerName) || state.newEventPage.showAddRelationship;

const makeMapStateToProps = () => {
    const eventAccessSelector = makeEventAccessSelector();
    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState, { program, stage }) => ({
        eventAccess: eventAccessSelector(state, { programId: program.id, stageId: stage.id }),
    });
};

const mapDispatchToProps = () => ({
});

export const AccessVerification: ComponentType<ContainerProps> =
  compose(
      connect(makeMapStateToProps, mapDispatchToProps),
      withBrowserBackWarning(defaultDialogProps, inEffect),
  )(AccessVerificationComponent);
