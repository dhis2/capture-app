import React from 'react';
import { OfflineListWrapper } from './OfflineListWrapper.container';

type Props = {
    listId?: string;
    noItemsText?: string;
    emptyListText?: string;
    [key: string]: any;
}

export class OfflineEventsList extends React.Component<Props> {
    render() {
        const { listId, noItemsText, emptyListText, ...passOnProps } = this.props;

        return (
            <OfflineListWrapper
                listId={listId}
                noItemsText={noItemsText}
                emptyListText={emptyListText}
                {...passOnProps}
            />
        );
    }
}
