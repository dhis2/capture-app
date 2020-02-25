// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import EventListUpdater from './EventListUpdater.component';
import { EventListLoaderContext } from './workingLists.context';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator(() => ({ margin: 10 }))(EventListUpdater));

type Props = {
    listId: string,
    currentTemplate: Object,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    currentPage: ?number,
    rowsPerPage: ?number,
    defaultConfig: Map<string, Object>,
    programId: string,
};

const EventListLoader = (props: Props) => {
    const {
        currentTemplate,
        listId,
        defaultConfig,
        programId,
        ...passOnProps
    } = props;

    const {
        eventListIsLoading,
        onLoadEventList,
        loadEventListError: loadError,
        onCancelLoadEventList,
        onUpdateEventList,
        onCancelUpdateEventList,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
    } = React.useContext(EventListLoaderContext);

    const hasContextChanged = React.useMemo(() => {
        return !onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, listContext);
    }, [
        onCheckSkipReload,
        programId,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
    ]);

    const prevTemplateRef = React.useRef(undefined);
    const prevListIdRef = React.useRef(undefined);
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, listContext) &&
            (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id) &&
            (!prevListIdRef.current || prevListIdRef.current === listId)) {
            prevTemplateRef.current = currentTemplate;
            prevListIdRef.current = listId;
            return undefined;
        }

        prevTemplateRef.current = currentTemplate;
        prevListIdRef.current = listId;

        if (currentTemplate.skipInitDuringAddProcedure) {
            return () => onCleanSkipInitAddingTemplate(currentTemplate, listId);
        }

        onLoadEventList(currentTemplate, defaultConfig, listId);
        return undefined;
    }, [
        listId,
        onLoadEventList,
        onCancelLoadEventList,
        defaultConfig,
        currentTemplate,
        onCheckSkipReload,
        onCleanSkipInitAddingTemplate,
        programId,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
    ]);

    React.useEffect(() => () => onCancelLoadEventList(listId), [onCancelLoadEventList, listId]);

    const ready = !hasContextChanged &&
        (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id || !!currentTemplate.skipInitDuringAddProcedure) &&
        !eventListIsLoading;

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
