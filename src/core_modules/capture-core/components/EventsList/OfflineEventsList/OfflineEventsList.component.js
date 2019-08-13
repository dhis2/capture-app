// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import OfflineListWrapper from './OfflineListWrapper.container';

type Props = {
    listId?: ?string,
}


class OfflineEventsList extends React.Component<Props> {
    render() {
        const { listId, noItemsText, emptyListText, ...passOnProps } = this.props;

        return (
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
