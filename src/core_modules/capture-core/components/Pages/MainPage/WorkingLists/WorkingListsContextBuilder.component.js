// @flow
import * as React from 'react';
import {
    ManagerContext,
    EventListConfigContext,
    EventListLoaderContext,
} from './workingLists.context';
import WorkingListsPreCleaner from './WorkingListsPreCleaner.component';

type PassOnProps = {|
    listId: string,
    templates: ?Object,
    onPreCleanData: Function,
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    skipReload: boolean,
    onResetSkipReload?: ?Function,
|};

type Props = {
    selectedTemplate: ?Object,
    onSelectTemplate: Function,
    onLoadEventList: Function,
    loadEventListError: ?string,
    onUpdateEventList: Function,
    onCancelLoadEventList: Function,
    onCancelUpdateEventList: Function,
    listMeta: ?Object,
    eventsData: ?Object,
    eventListIsLoading: boolean,
    ...PassOnProps,
};

const WorkingListsContextBuilder = (props: Props) => {
    const {
        selectedTemplate,
        onSelectTemplate,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
        listMeta,
        eventsData,
        eventListIsLoading,
        ...passOnProps
    } = props;

    const managerData = React.useMemo(() => ({
        selectedTemplate,
        onSelectTemplate,
    }), [selectedTemplate, onSelectTemplate]);

    const eventListConfig = React.useMemo(() => ({
        listMeta,
    }), [listMeta]);

    const eventListData = React.useMemo(() => ({
        eventsData,
        eventListIsLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
    }), [
        eventsData,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        onCancelLoadEventList,
        onCancelUpdateEventList,
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
                    />
                </EventListConfigContext.Provider>
            </EventListLoaderContext.Provider>
        </ManagerContext.Provider>
    );
};

export default WorkingListsContextBuilder;
