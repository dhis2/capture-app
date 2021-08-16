// @flow
import { connect } from 'react-redux';
import { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { compose } from 'redux';
import { NewEnrollmentEventComponent } from './NewEnrollmentEvent.component';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { makeEventAccessSelector } from './NewEnrollmentEvent.selectors';
import { withLoadingIndicator } from '../../../HOC';

const dialogConfig = {
    header: i18n.t('Unsaved changes'),
    text: i18n.t('Leaving this page will discard the changes you made to this event.'),
    confirmText: i18n.t('Yes, discard'),
    cancelText: i18n.t('No, stay here'),
};

const inEffect = (state: ReduxState) => dataEntryHasChanges(state, 'singleEvent-addEvent') || state.newEventPage.showAddRelationship;

const makeMapStateToProps = () => {
    const eventAccessSelector = makeEventAccessSelector();
    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState, { id }) => ({ ready: state.dataEntries[id],
        eventAccess: eventAccessSelector(state) });
};

const mapDispatchToProps = () => ({
});

export const NewEnrollmentEvent: ComponentType<{| id: string |}> =
  compose(
      connect(makeMapStateToProps, mapDispatchToProps),
      withLoadingIndicator(),
      withBrowserBackWarning(dialogConfig, inEffect),
  )(NewEnrollmentEventComponent);
