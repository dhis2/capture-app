// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import EventListUpdater from './EventListUpdater.component';
import { EventListLoaderContext } from './workingLists.context';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(EventListUpdater));

type Props = {
    listId: string,
    eventsData: ?Object,
    selectedTemplate: Object,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    currentPage: ?number,
    rowsPerPage: ?number,
};

const EventListLoader = (props: Props) => {
    const {
        selectedTemplate,
        listId,
        ...passOnProps
    } = props;

    const {
        eventsData,
        onLoadEventList,
        loadEventListError: loadError,
        onCancelLoadEventList,
        onUpdateEventList,
        onCancelUpdateEventList,
    } = React.useContext(EventListLoaderContext);

    React.useEffect(() => {
        if (eventsData !== undefined) {
            return undefined;
        }
        onLoadEventList(selectedTemplate, listId);
        return () => onCancelLoadEventList(listId);
    }, []);

    const ready = eventsData !== undefined;

    return (
        <EventListUpdaterWithLoadingIndicator
            {...passOnProps}
            ready={ready}
            error={loadError}
            listId={listId}
            onUpdateEventList={onUpdateEventList}
            onCancelUpdateEventList={onCancelUpdateEventList}
        />
    );
};

export default EventListLoader;
