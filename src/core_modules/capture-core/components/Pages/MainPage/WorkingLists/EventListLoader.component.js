// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import EventListUpdater from './EventListUpdater.component';
import { EventListLoaderContext } from './workingLists.context';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(EventListUpdater));

type Props = {
    listId: string,
    selectedTemplate: Object,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    currentPage: ?number,
    rowsPerPage: ?number,
    defaultConfig: Map<string, Object>,
};

const EventListLoader = (props: Props) => {
    const {
        selectedTemplate,
        listId,
        defaultConfig,
        ...passOnProps
    } = props;

    const templateIsChanging = React.useRef(false);
    const firstRun = React.useRef(true);

    const {
        eventsData,
        eventListIsLoading,
        onLoadEventList,
        loadEventListError: loadError,
        onCancelLoadEventList,
        onUpdateEventList,
        onCancelUpdateEventList,
    } = React.useContext(EventListLoaderContext);

    React.useEffect(() => {
        if (eventsData !== undefined && (!templateIsChanging.current || firstRun.current)) {
            firstRun.current = false;
            templateIsChanging.current = false;
            return undefined;
        }

        onLoadEventList(selectedTemplate, defaultConfig, listId);
        firstRun.current = false;
        templateIsChanging.current = false;
        return () => onCancelLoadEventList(listId);
    }, [
        eventsData,
        listId,
        onLoadEventList,
        onCancelLoadEventList,
        defaultConfig,
        selectedTemplate,
    ]);

    React.useMemo(() => {
        templateIsChanging.current = true;
    }, [
        selectedTemplate,
    ]);

    const ready = !templateIsChanging.current && !eventListIsLoading;

    return (
        <EventListUpdaterWithLoadingIndicator
            {...passOnProps}
            ready={ready}
            error={loadError}
            listId={listId}
            defaultConfig={defaultConfig}
            onUpdateEventList={onUpdateEventList}
            onCancelUpdateEventList={onCancelUpdateEventList}
        />
    );
};

export default EventListLoader;
