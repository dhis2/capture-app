// @flow
import * as React from 'react';
import {
    ManagerContext,
    EventListConfigContext,
    EventListLoaderContext,
} from './workingLists.context';
import WorkingListsPreCleaner from './WorkingListsPreCleaner.component';

type PassOnProps = {|
    onPreCleanData: Function,
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    skipReload: boolean,
    onResetSkipReload?: ?Function,
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
    }), [
        eventsData,
        eventListIsLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        onCleanSkipInitAddingTemplate,
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
                    <WorkingListsPreCleaner
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
