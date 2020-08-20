// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import { ListViewUpdater } from './ListViewUpdater.component';
import { ListViewLoaderContext } from './workingLists.context';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator(() => ({ margin: 10 }))(ListViewUpdater));

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

// eslint-disable-next-line complexity
export const ListViewLoader = (props: Props) => {
    const {
        currentTemplate,
        listId,
        defaultConfig,
        programId,
        ...passOnProps
    } = props;

    const {
        isLoading,
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
        lastEventIdDeleted,
        dirtyEventList,
    } = React.useContext(ListViewLoaderContext);

    const hasContextChanged = React.useMemo(() => !onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, listContext), [
        onCheckSkipReload,
        programId,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
    ]);

    const prevTemplateRef = React.useRef(undefined);
    const prevListIdRef = React.useRef(undefined);
    const firstRunRef = React.useRef(true);
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, listContext) &&
            (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id) &&
            (!prevListIdRef.current || prevListIdRef.current === listId) &&
            (!dirtyEventList || !firstRunRef.current)) {
            prevTemplateRef.current = currentTemplate;
            prevListIdRef.current = listId;
            firstRunRef.current = false;
            return undefined;
        }

        prevTemplateRef.current = currentTemplate;
        prevListIdRef.current = listId;
        firstRunRef.current = false;

        if (currentTemplate.skipInitDuringAddProcedure) {
            return () => onCleanSkipInitAddingTemplate(currentTemplate, listId);
        }

        onLoadEventList(currentTemplate,
            { programId, orgUnitId, categories, lastTransaction },
            { defaultConfig, listId },
        );
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
        dirtyEventList,
    ]);

    React.useEffect(() => () => onCancelLoadEventList(listId), [onCancelLoadEventList, listId]);

    const ready = !hasContextChanged &&
        (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id || !!currentTemplate.skipInitDuringAddProcedure) &&
        (!prevListIdRef.current || prevListIdRef.current === listId) &&
        (!dirtyEventList || !firstRunRef.current) &&
        !isLoading;

    return (
        <EventListUpdaterWithLoadingIndicator
            {...passOnProps}
            programId={programId}
            ready={ready}
            error={loadError}
            listId={listId}
            defaultConfig={defaultConfig}
            onUpdateEventList={onUpdateEventList}
            onCancelUpdateEventList={onCancelUpdateEventList}
            lastEventIdDeleted={lastEventIdDeleted}
        />
    );
};
