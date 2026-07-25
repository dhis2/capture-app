import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { OfflineListWrapper } from './OfflineListWrapper.container';
import { useStageLabel } from '../../../metaData';

type Props = {
    listId?: string;
    noItemsText?: string;
    emptyListText?: string;
    [key: string]: any;
}

class OfflineEventsListClass extends React.Component<Props> {
    render() {
        const { listId, noItemsText, emptyListText, ...passOnProps } = this.props;

        return (
            <OfflineListWrapper
                listId={listId}
                noItemsText={noItemsText}
                emptyListText={emptyListText || i18n.t('Data for offline list not present')}
                {...passOnProps}
            />
        );
    }
}

export const OfflineEventsList = (props: Props) => {
    const events = useStageLabel('event', { plural: true }) ?? i18n.t('events');
    const noItemsText = props.noItemsText || i18n.t('No {{events}} to display', {
        events,
        interpolation: { escapeValue: false },
    });
    return <OfflineEventsListClass {...props} noItemsText={noItemsText} />;
};
