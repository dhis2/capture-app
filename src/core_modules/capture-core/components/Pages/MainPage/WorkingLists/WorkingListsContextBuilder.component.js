// @flow
import * as React from 'react';
import { ManagerContext, EventListLoaderContext } from './workingLists.context';
import WorkingListsPreCleaner from './WorkingListsPreCleaner.component';

type PassOnProps = {|
    listId: string,
    templates: ?Object,
    onPreCleanData: Function,
    onLoadTemplates: Function,
|};

type Props = {
    selectedTemplate: ?Object,
    onSelectTemplate: Function,
    eventListIsLoading: boolean,
    onLoadEventList: Function,
    loadEventListError: ?string,
    onUpdateEventList: Function,
    filters: ?Object,
    ...PassOnProps,
};

const WorkingListsContextBuilder = (props: Props) => {
    const {
        selectedTemplate,
        onSelectTemplate,
        eventListIsLoading,
        onLoadEventList,
        loadEventListError,
        onUpdateEventList,
        filters,
        ...passOnProps
    } = props;

    const managerData = React.useMemo(() => ({
        selectedTemplate,
        onSelectTemplate,
    }), [selectedTemplate, onSelectTemplate]);

    const currentFilters = React.useMemo(() => {
        if(!filters) {
            return filters;
        }
        
    }, [
        filters,
    ]);

    const eventListData = React.useMemo(() => ({
        onLoadEventList,
        eventListIsLoading,
        loadEventListError,
        onUpdateEventList,
        filters,
    }), [ onLoadEventList, eventListIsLoading, loadEventListError, onUpdateEventList ]);

    return (
        <ManagerContext.Provider
            value={managerData}
        >
            <EventListLoaderContext.Provider
                value={eventListData}
            >
                <WorkingListsPreCleaner
                    {...passOnProps}
                />
            </EventListLoaderContext.Provider>
        </ManagerContext.Provider>
    );
};

export default WorkingListsContextBuilder;
