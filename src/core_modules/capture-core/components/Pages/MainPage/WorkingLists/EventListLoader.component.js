// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import EventListUpdater from './EventListUpdater.component';
import { EventListLoaderContext } from './workingLists.context';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(EventListUpdater));

type Props = {
    listId: string,
    currentTemplate: Object,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    currentPage: ?number,
    rowsPerPage: ?number,
    defaultConfig: Map<string, Object>,
};

const EventListLoader = (props: Props) => {
    const {
        currentTemplate,
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
        onCleanSkipInitAddingTemplate,
    } = React.useContext(EventListLoaderContext);

    React.useEffect(() => {
        if (currentTemplate.skipInitDuringAddProcedure) {
            templateIsChanging.current = false;
            return () => onCleanSkipInitAddingTemplate(currentTemplate, listId);
        }
        if (eventsData !== undefined && (!templateIsChanging.current || firstRun.current)) {
            firstRun.current = false;
            templateIsChanging.current = false;
            return undefined;
        }

        onLoadEventList(currentTemplate, defaultConfig, listId);
        firstRun.current = false;
        templateIsChanging.current = false;
        return () => onCancelLoadEventList(listId);
    }, [
        eventsData,
        listId,
        onLoadEventList,
        onCancelLoadEventList,
        defaultConfig,
        currentTemplate,
        onCleanSkipInitAddingTemplate,
    ]);

    React.useMemo(() => {
        templateIsChanging.current = true;
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        currentTemplate.id,
    ]);

    const ready = currentTemplate.skipInitDuringAddProcedure ||
        (!templateIsChanging.current && !eventListIsLoading);

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
