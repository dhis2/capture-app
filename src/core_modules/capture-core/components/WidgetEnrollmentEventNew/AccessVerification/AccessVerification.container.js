// @flow
import { connect } from 'react-redux';
import { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { compose } from 'redux';
import {
    AccessVerificationComponent,
} from './AccessVerification.component';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { makeEventAccessSelector } from './accessVerification.selectors';
import type { ContainerProps } from './accessVerification.types';

const dialogConfig = {
    header: i18n.t('Discard unsaved changes?'),
    text: i18n.t('This event has unsaved changes. Leaving this page without saving will lose these changes. Are you sure you want to discard unsaved changes?'),
    destructiveText: i18n.t('Yes, discard changes'),
    cancelText: i18n.t('No, stay here'),
};

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
      withBrowserBackWarning(dialogConfig, inEffect),
  )(AccessVerificationComponent);
