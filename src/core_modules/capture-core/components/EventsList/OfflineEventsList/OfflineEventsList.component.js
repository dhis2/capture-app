// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import OfflineListWrapper from './OfflineListWrapper.container';

type Props = {
  listId?: ?string,
};

class OfflineEventsList extends React.Component<Props> {
  render() {
    // $FlowFixMe[prop-missing] automated comment
    const { listId, noItemsText, emptyListText, ...passOnProps } = this.props;

    return (
      // $FlowFixMe[cannot-spread-inexact] automated comment
      <OfflineListWrapper
        listId={listId}
        noItemsText={noItemsText || i18n.t('No events to display')}
        emptyListText={emptyListText || i18n.t('Data for offline list not present')}
        {...passOnProps}
      />
    );
  }
}

export default OfflineEventsList;
