// @flow
import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../../HOC';
import { ListViewUpdater } from '../ListViewUpdater';
import { ListViewLoaderContext } from '../workingLists.context';
import { useIsContextInSync } from './useIsContextInSync';
import type { Props } from './listViewLoader.types';

const EventListUpdaterWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator(() => ({ margin: 10 }))(ListViewUpdater));

const hasTemplateChange = (currentTemplate, prevTemplate, viewPreloaded) =>
    (prevTemplate && currentTemplate.id !== prevTemplate.id && !viewPreloaded);

const useCalculateTriggerLoad = ({
    programId,
    orgUnitId,
    categories,
    loadedViewContext,
    currentTemplate,
    viewPreloaded,
    dirtyView,
    firstRun,
    prevTemplate,
}) => {
    const contextInSync = useIsContextInSync(programId, orgUnitId, categories, loadedViewContext);
    let triggerLoad = false;
    if (!contextInSync || hasTemplateChange(currentTemplate, prevTemplate, viewPreloaded) || (dirtyView && firstRun)) {
        triggerLoad = true;
    }
    return triggerLoad;
};

const useLoadView = ({
    programId,
    orgUnitId,
    categories,
    loadedViewContext,
    currentTemplate,
    dirtyView,
    onLoadView,
    onCancelLoadView,
    viewPreloaded,
}) => {
    const firstRunRef = useRef(true);
    const prevTemplateRef = useRef(undefined);
    const triggerLoadRef = useRef(true);
    const viewLoadedOnFirstRunRef = useRef(false);

    const triggerLoad = useCalculateTriggerLoad({
        programId,
        orgUnitId,
        categories,
        loadedViewContext,
        currentTemplate,
        viewPreloaded,
        dirtyView,
        firstRun: firstRunRef.current,
        prevTemplate: prevTemplateRef.current,
    });
    triggerLoadRef.current = triggerLoad;

    const cancelLoadViewIfApplicable = useCallback(() => {
        triggerLoadRef.current && onCancelLoadView && onCancelLoadView();
    }, [onCancelLoadView]);

    useEffect(() => {
        prevTemplateRef.current = currentTemplate;
        firstRunRef.current = false;

        if (triggerLoad) {
            onLoadView(currentTemplate,
                { programId, orgUnitId, categories },
            );
        }
        return () => cancelLoadViewIfApplicable();
    }, [
        triggerLoad,
        onLoadView,
        currentTemplate,
        programId,
        orgUnitId,
        categories,
        cancelLoadViewIfApplicable,
    ]);

    useEffect(() => () => onCancelLoadView && onCancelLoadView(), [onCancelLoadView]);

    if (firstRunRef.current && triggerLoad) {
        viewLoadedOnFirstRunRef.current = true;
    }

    return {
        triggerLoad,
        viewLoadedOnFirstRun: viewLoadedOnFirstRunRef.current,
    };
};


export const ListViewLoader = memo<Props>((props: Props) => {
    const {
        currentTemplate,
        programId,
        ...passOnProps
    } = props;

    const context = useContext(ListViewLoaderContext);
    if (!context) {
        throw Error('missing ListViewLoaderContext');
    }

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
        orgUnitId,
        categories,
        dirtyView,
        loadedViewContext,
        viewPreloaded,
    } = context;

    const { triggerLoad, viewLoadedOnFirstRun } = useLoadView({
        programId,
        orgUnitId,
        categories,
        loadedViewContext,
        currentTemplate,
        dirtyView,
        onLoadView,
        onCancelLoadView,
        viewPreloaded,
    });

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
            ready={!triggerLoad && !loading}
            error={loadViewError}
            onUpdateList={onUpdateList}
            viewLoadedOnFirstRun={viewLoadedOnFirstRun}
        />
    );
});
