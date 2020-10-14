// @flow
import React, { memo } from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../../HOC';
import { ListViewUpdater } from '../ListViewUpdater';
import { ListViewLoaderContext } from '../workingLists.context';
import type { Props } from './listViewLoader.types';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator(() => ({ margin: 10 }))(ListViewUpdater));

// eslint-disable-next-line complexity
export const ListViewLoader = memo<Props>((props: Props) => {
    const {
        currentTemplate,
        programId,
        loadedContext,
        ...passOnProps
    } = props;

    const {
        sortById,
        sortByDirection,
        filters,
        columns,
        loading,
        onLoadView,
        loadViewError,
        onCancelLoadView,
        onUpdateList,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        onCheckSkipReload,
        dirtyEventList,
    } = React.useContext(ListViewLoaderContext);

    const hasContextChanged = React.useMemo(() => !onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, loadedContext), [
        onCheckSkipReload,
        programId,
        orgUnitId,
        categories,
        lastTransaction,
        loadedContext,
    ]);

    const prevTemplateRef = React.useRef(undefined);
    const firstRunRef = React.useRef(true);
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (onCheckSkipReload(programId, orgUnitId, categories, lastTransaction, loadedContext) &&
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

        onLoadView(currentTemplate,
            { programId, orgUnitId, categories, lastTransaction },
        );
        return undefined;
    }, [
        onLoadView,
        currentTemplate,
        onCheckSkipReload,
        onCleanSkipInitAddingTemplate,
        programId,
        orgUnitId,
        categories,
        lastTransaction,
        loadedContext,
        dirtyEventList,
    ]);

    React.useEffect(() => () => onCancelLoadView && onCancelLoadView(), [onCancelLoadView]);

    const ready = !hasContextChanged &&
        (!prevTemplateRef.current || currentTemplate.id === prevTemplateRef.current.id || !!currentTemplate.skipInitDuringAddProcedure) &&
        (!dirtyEventList || !firstRunRef.current) &&
        !loading;

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
            error={loadViewError}
            onUpdateList={onUpdateList}
        />
    );
});
