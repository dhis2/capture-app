import { OrgUnitFetcher as OrgUnitFetcherComponent } from './OrgUnitFetcher.component';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { getDiscardDialogProps } from '../../Dialogs/DiscardDialog.constants';

const inEffect = (state: any, ownProps: any) =>
    dataEntryHasChanges(state, ownProps.widgetReducerName) || state.newEventPage.showAddRelationship;

export const OrgUnitFetcher = withBrowserBackWarning(
    ({ event }: { event: string }) => getDiscardDialogProps({ event }),
    inEffect,
)(OrgUnitFetcherComponent);
