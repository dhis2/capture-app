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
  loadTemplatesError: Function,
  templatesForProgramId: ?string,
  templatesAreLoading: boolean,
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
  eventListIsUpdating: boolean,
  eventListIsUpdatingWithDialog: boolean,
  onAddTemplate: Function,
  onUpdateTemplate: Function,
  onDeleteTemplate: Function,
  onCleanSkipInitAddingTemplate: Function,
  onUnloadingContext: Function,
  orgUnitId: string,
  categories: Object,
  lastTransaction: number,
  listContext: ?Object,
  onCheckSkipReload: Function,
  lastEventIdDeleted: ?string,
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
    eventListIsUpdating,
    eventListIsUpdatingWithDialog,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    onCleanSkipInitAddingTemplate,
    onUnloadingContext,
    orgUnitId,
    categories,
    lastTransaction,
    listContext,
    onCheckSkipReload,
    lastEventIdDeleted,
    ...passOnProps
  } = props;

  const dirtyTemplatesStateFirstRunRef = React.useRef(undefined);
  React.useMemo(() => {
    if (dirtyTemplatesStateFirstRunRef.current !== undefined) {
      return;
    }

    if (!allTemplates) {
      dirtyTemplatesStateFirstRunRef.current = false;
      return;
    }

    dirtyTemplatesStateFirstRunRef.current = allTemplates.some(
      (template) => template.nextEventQueryCriteria || template.notPreserved || template.deleted,
    );
  }, [allTemplates]);

  const dirtyEventListStateFirstRunRef = React.useRef(undefined);
  React.useMemo(() => {
    if (dirtyEventListStateFirstRunRef.current !== undefined) {
      return;
    }

    if (eventListIsLoading || eventListIsUpdating || eventListIsUpdatingWithDialog) {
      dirtyEventListStateFirstRunRef.current = true;
      return;
    }

    dirtyEventListStateFirstRunRef.current = false;
  }, [eventListIsLoading, eventListIsUpdating, eventListIsUpdatingWithDialog]);

  const managerData = React.useMemo(
    () => ({
      currentTemplate,
      onSelectTemplate,
    }),
    [currentTemplate, onSelectTemplate],
  );

  const eventListConfig = React.useMemo(
    () => ({
      listMeta,
      columnOrder,
      onAddTemplate,
      onUpdateTemplate,
      onDeleteTemplate,
    }),
    [listMeta, columnOrder, onAddTemplate, onUpdateTemplate, onDeleteTemplate],
  );

  const eventListData = React.useMemo(
    () => ({
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
      lastEventIdDeleted,
      dirtyEventList:
        dirtyTemplatesStateFirstRunRef.current || dirtyEventListStateFirstRunRef.current,
    }),
    [
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
      lastEventIdDeleted,
    ],
  );

  const templates = React.useMemo(() => allTemplates && allTemplates.filter((t) => !t.deleted), [
    allTemplates,
  ]);

  React.useEffect(() => () => onUnloadingContext(listId), [onUnloadingContext, listId]);

  return (
    <ManagerContext.Provider value={managerData}>
      <EventListLoaderContext.Provider value={eventListData}>
        <EventListConfigContext.Provider value={eventListConfig}>
          <TemplatesLoader
            {...passOnProps}
            templates={templates}
            listId={listId}
            dirtyTemplates={!!dirtyTemplatesStateFirstRunRef.current}
          />
        </EventListConfigContext.Provider>
      </EventListLoaderContext.Provider>
    </ManagerContext.Provider>
  );
};

export default WorkingListsContextBuilder;
