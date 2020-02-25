// @flow
import * as React from 'react';
import {
    ManagerContext,
    EventListConfigContext,
    EventListLoaderContext,
} from './workingLists.context';
import TemplatesLoader from './TemplatesLoader.component';

type PassOnProps = {|
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    programId: string,
|};

type Props = {
    listId: string,
    templates: ?Object,
    currentTemplate: ?Object,
    onSelectTemplate: Function,
    onLoadEventList: Function,
    loadEventListError: ?string,
    onUpdateEventList: Function,
    onCancelLoadEventList: Function,
    onCancelUpdateEventList: Function,
    listMeta: ?Object,
    columnOrder: ?Array<Object>,
    eventsData: ?Object,
    eventListIsLoading: boolean,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onCleanSkipInitAddingTemplate: Function,
    onUnloadingContext: Function,
    orgUnitId: string,
    categories: Object,
    lastTransaction: number,
    listContext: ?Object,
    onCheckSkipReload: Function,
    ...PassOnProps,
};

const WorkingListsContextBuilder = (props: Props) => {
    const {
        listId,
        templates: allTemplates,
        currentTemplate,
        onSelectTemplate,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        listMeta,
        columnOrder,
        eventsData,
        eventListIsLoading,
        onAddTemplate,
        onUpdateTemplate,
        onCleanSkipInitAddingTemplate,
        onUnloadingContext,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
        ...passOnProps
    } = props;

    const managerData = React.useMemo(() => ({
        currentTemplate,
        onSelectTemplate,
    }), [currentTemplate, onSelectTemplate]);

    const eventListConfig = React.useMemo(() => ({
        listMeta,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
    }), [
        listMeta,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
    ]);

    const eventListData = React.useMemo(() => ({
        eventsData,
        eventListIsLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
    }), [
        eventsData,
        eventListIsLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        onCleanSkipInitAddingTemplate,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        onCheckSkipReload,
    ]);

    const templates = React.useMemo(() =>
        allTemplates && allTemplates.filter(t => !t.deleted), [
        allTemplates,
    ]);

    React.useEffect(() => {
        return () => onUnloadingContext(listId);
    }, [
        onUnloadingContext,
        listId,
    ]);

    return (
        <ManagerContext.Provider
            value={managerData}
        >
            <EventListLoaderContext.Provider
                value={eventListData}
            >
                <EventListConfigContext.Provider
                    value={eventListConfig}
                >
                    <TemplatesLoader
                        {...passOnProps}
                        templates={templates}
                        listId={listId}
                    />
                </EventListConfigContext.Provider>
            </EventListLoaderContext.Provider>
        </ManagerContext.Provider>
    );
};

export default WorkingListsContextBuilder;
