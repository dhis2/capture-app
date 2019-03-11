// @flow
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import SelectionsComplete from './SelectionsComplete.component';
import withBrowserBackWarning from '../../../../HOC/withBrowserBackWarning';
import dataEntryHasChanges from '../../../DataEntry/common/dataEntryHasChanges';

const dialogConfig = {
    header: i18n.t('Unsaved changes'),
    text: i18n.t('Leaving this page will discard the changes you made to this event.'),
    confirmText: i18n.t('Yes, discard'),
    cancelText: i18n.t('No, stay here'),
};

const inEffect = (state: ReduxState) => dataEntryHasChanges(state, 'singleEvent-newEvent') || state.newEventPage.showAddRelationship;

const mapStateToProps = (state: ReduxState) => ({
    showAddRelationship: !!state.newEventPage.showAddRelationship,
});

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(withBrowserBackWarning(dialogConfig, inEffect)(SelectionsComplete));
