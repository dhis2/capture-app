// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import { EventList } from '../EventsList';
import { EventListLoaderContext } from './workingLists.context';

const EventListWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(EventList));

type Props = {
    listId: string,
    selectedTemplate: Object,
    filters: Object,
};
  
function useCustomCompareMemoize(value) {
    const ref = React.useRef();

    debugger;
    // const filtersEqual = 

    /*
    if (!deepCompareEquals(value, ref.current)) {
      ref.current = value
    }
    */
  
    return ref.current
}
  
function useUpdateListEffect(callback, dependencies) {
    const firstRun = React.useRef(true);

    React.useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        callback();        
    }, useCustomCompareMemoize(dependencies))
}

const EventListLoader = (props: Props) => {
    const { selectedTemplate, listId, ...passOnProps } = props;
    const [ isInitiating, setInitStatus ] = React.useState(true);
    const {
        eventListIsLoading: isLoading,
        onLoadEventList,
        loadEventListError: loadError,
        onUpdateEventList,
    } = React.useContext(EventListLoaderContext);

    React.useEffect(() => {
        onLoadEventList(selectedTemplate, listId);
        setInitStatus(false);
    }, []);

    React.useUpdateListEffect(() => {
        onUpdateEventList();
    }, []);

    const ready = !isLoading && !isInitiating;

    return (
        <EventListWithLoadingIndicator
            ready={ready}
            error={loadError}
            listId={listId}
        />
    );
}

export default EventListLoader;
