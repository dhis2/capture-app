// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import EventListLoader from './EventListLoader.component';
import { TemplateMaintenance, dialogModes } from './TemplateMaintenance';
import type { WorkingListTemplate } from './workingLists.types';

const getStyles = (theme: Theme) => ({
  delete: {
    color: theme.palette.error.dark,
  },
});

type PassOnProps = {
  programId: string,
  eventsData: ?Object,
  currentPage: ?number,
  rowsPerPage: ?number,
};

type Props = {
  ...PassOnProps,
  listId: string,
  currentTemplate: WorkingListTemplate,
  filters: Object,
  sortById: ?string,
  sortByDirection: ?string,
  columnOrder: ?Array<Object>,
  onAddTemplate: Function,
  onUpdateTemplate: Function,
  onDeleteTemplate: Function,
  defaultConfig: Map<string, Object>,
  currentListIsModified: boolean,
  classes: Object,
};

const EventListConfigMenuContent = (props: Props) => {
  const {
    listId,
    currentTemplate,
    filters,
    sortById,
    sortByDirection,
    columnOrder,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    defaultConfig,
    currentListIsModified,
    classes,
    ...passOnProps
  } = props;
  const [maintenanceDialogOpenMode, setMaintenanceDialogOpenMode] = React.useState(null);
  const templateMaintenanceInstance = React.useRef(null);

  const closeHandler = React.useCallback(() => {
    setMaintenanceDialogOpenMode(null);
  }, []);

  const updateTemplateHandler = React.useCallback(
    (...args) => {
      setMaintenanceDialogOpenMode(null);
      onUpdateTemplate(...args);
    },
    [onUpdateTemplate],
  );

  const addTemplateHandler = React.useCallback(
    (...args) => {
      setMaintenanceDialogOpenMode(null);
      onAddTemplate(...args);
    },
    [onAddTemplate],
  );

  const deleteTemplateHandler = React.useCallback(
    (...args) => {
      setMaintenanceDialogOpenMode(null);
      onDeleteTemplate(...args);
    },
    [onDeleteTemplate],
  );

  const getSaveItem = React.useCallback(
    () => ({
      key: 'save',
      clickHandler: () => {
        // $FlowFixMe[incompatible-use] automated comment
        templateMaintenanceInstance.current.updateTemplateHandler();
      },
      element: i18n.t('Update view'),
    }),
    [],
  );

  const getSaveAsItem = React.useCallback((isDefaultView: boolean, isModified: boolean) => {
    if (isDefaultView && !isModified) {
      return {
        key: 'saveAs',
        element: i18n.t('Save current view...'),
      };
    }

    return {
      key: 'saveAs',
      clickHandler: () => {
        setMaintenanceDialogOpenMode(dialogModes.NEW);
      },
      element: isDefaultView ? i18n.t('Save current view...') : i18n.t('Save current view as...'),
    };
  }, []);

  const getDeleteItem = React.useCallback(
    () => ({
      key: 'delete',
      clickHandler: () => {
        setMaintenanceDialogOpenMode(dialogModes.DELETE);
      },
      element: <div className={classes.delete}>{i18n.t('Delete view')}</div>,
    }),
    [classes.delete],
  );

  const getShareItem = React.useCallback(
    () => ({
      key: 'share',
      clickHandler: () => {
        setMaintenanceDialogOpenMode(dialogModes.SHARING);
      },
      element: i18n.t('Share view...'),
    }),
    [],
  );

  const getSavedViewSubHeader = React.useCallback(
    (viewName: string) => ({
      key: 'savedViewSubHeader',
      subHeader: viewName.length > 30 ? `${viewName.substring(0, 27)}...` : viewName,
    }),
    [],
  );

  // eslint-disable-next-line complexity
  const customMenuContents = React.useMemo(() => {
    const currentViewContents = [];
    const savedViewContents = [];

    const { access, isDefault, notPreserved, displayName } = currentTemplate;

    currentViewContents.push(getSaveAsItem(!!isDefault, currentListIsModified));

    if (!isDefault && !notPreserved && access.write && access.update && currentListIsModified) {
      savedViewContents.push(getSaveItem());
    }

    if (!isDefault && !notPreserved && access.manage) {
      savedViewContents.push(getShareItem());
    }

    if (!isDefault && !notPreserved && access.delete) {
      savedViewContents.push(getDeleteItem());
    }

    if (savedViewContents.length > 0) {
      savedViewContents.splice(0, 0, getSavedViewSubHeader(displayName));
    }

    return [...currentViewContents, ...savedViewContents];
  }, [
    currentTemplate,
    getSaveItem,
    getSaveAsItem,
    getDeleteItem,
    getShareItem,
    currentListIsModified,
    getSavedViewSubHeader,
  ]);

  return (
    <>
      <EventListLoader
        {...passOnProps}
        listId={listId}
        defaultConfig={defaultConfig}
        filters={filters}
        sortById={sortById}
        sortByDirection={sortByDirection}
        currentTemplate={currentTemplate}
        customMenuContents={customMenuContents}
      />
      <TemplateMaintenance
        // $FlowFixMe[incompatible-type] automated comment
        ref={templateMaintenanceInstance}
        listId={listId}
        onClose={closeHandler}
        mode={maintenanceDialogOpenMode}
        currentTemplate={currentTemplate}
        filters={filters}
        sortById={sortById}
        sortByDirection={sortByDirection}
        columnOrder={columnOrder}
        onAddTemplate={addTemplateHandler}
        onUpdateTemplate={updateTemplateHandler}
        onDeleteTemplate={deleteTemplateHandler}
        defaultConfig={defaultConfig}
      />
    </>
  );
};

export default withStyles(getStyles)(EventListConfigMenuContent);
