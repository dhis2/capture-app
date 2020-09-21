// @flow
import React, { memo } from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import { ListViewUpdater } from './ListViewUpdater.component';
import { ListViewLoaderContext } from './workingLists.context';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator(() => ({ margin: 10 }))(ListViewUpdater));

type Props = {
    currentTemplate: Object,
    programId: string,
};

// eslint-disable-next-line complexity
export const ListViewLoader = memo<Props>((props: Props) => {
    const {
        currentTemplate,
        programId,
        ...passOnProps
    } = props;

    const {
        sortById,
        sortByDirection,
        filters,
        columns,
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
    const firstRunRef = React.useRef(true);
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, listContext) &&
            (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id) &&
            (!dirtyEventList || !firstRunRef.current)) {
            prevTemplateRef.current = currentTemplate;
            firstRunRef.current = false;
            return undefined;
        }

        prevTemplateRef.current = currentTemplate;
        firstRunRef.current = false;

        if (currentTemplate.skipInitDuringAddProcedure) {
            return () => onCleanSkipInitAddingTemplate(currentTemplate);
        }

        onLoadEventList(currentTemplate,
            { programId, orgUnitId, categories, lastTransaction },
        );
        return undefined;
    }, [
        onLoadEventList,
        onCancelLoadEventList,
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

    React.useEffect(() => () => onCancelLoadEventList(), [onCancelLoadEventList]);

    const ready = !hasContextChanged &&
        (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id || !!currentTemplate.skipInitDuringAddProcedure) &&
        (!dirtyEventList || !firstRunRef.current) &&
        !isLoading;

    return (
        <EventListUpdaterWithLoadingIndicator
            {...passOnProps}
            sortById={sortById}
            sortByDirection={sortByDirection}
            filters={filters}
            columns={columns}
            programId={programId}
            orgUnitId={orgUnitId}
            categories={categories}
            ready={ready}
            error={loadError}
            onUpdateEventList={onUpdateEventList}
            onCancelUpdateEventList={onCancelUpdateEventList}
            lastEventIdDeleted={lastEventIdDeleted}
        />
    );
});
