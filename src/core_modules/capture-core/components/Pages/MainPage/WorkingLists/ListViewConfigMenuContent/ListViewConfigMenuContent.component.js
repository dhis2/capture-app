// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { ListViewLoader } from '../ListViewLoader';
import { TemplateMaintenance, dialogModes } from '../TemplateMaintenance';
import type { Props } from './listViewConfigMenuContent.types';

const getStyles = (theme: Theme) => ({
  delete: {
    color: theme.palette.error.dark,
  },
});

const ListViewConfigMenuContentPlain = (props: Props) => {
  const {
    currentTemplate,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate,
    currentViewHasTemplateChanges,
    classes,
    customListViewMenuContents,
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

  const getSaveAsItem = React.useCallback((viewIsDefault: boolean, modified: boolean) => {
    if (viewIsDefault && !modified) {
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
      element: viewIsDefault ? i18n.t('Save current view...') : i18n.t('Save current view as...'),
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
  const customListViewMenuContentsExtended = React.useMemo(() => {
    const currentViewContents = [];
    const savedViewContents = [];

    const { access, isDefault, notPreserved, name } = currentTemplate;

    currentViewContents.push(getSaveAsItem(!!isDefault, currentViewHasTemplateChanges));

    if (
      !isDefault &&
      !notPreserved &&
      access.write &&
      access.update &&
      currentViewHasTemplateChanges
    ) {
      savedViewContents.push(getSaveItem());
    }

    if (!isDefault && !notPreserved && access.manage) {
      savedViewContents.push(getShareItem());
    }

    if (!isDefault && !notPreserved && access.delete) {
      savedViewContents.push(getDeleteItem());
    }

    if (savedViewContents.length > 0) {
      savedViewContents.splice(0, 0, getSavedViewSubHeader(name));
    }

    return [...(customListViewMenuContents || []), ...currentViewContents, ...savedViewContents];
  }, [
    currentTemplate,
    getSaveItem,
    getSaveAsItem,
    getDeleteItem,
    getShareItem,
    currentViewHasTemplateChanges,
    getSavedViewSubHeader,
    customListViewMenuContents,
  ]);

  return (
    <>
      <ListViewLoader
        {...passOnProps}
        currentTemplate={currentTemplate}
        customListViewMenuContents={customListViewMenuContentsExtended}
      />
      <TemplateMaintenance
        // $FlowFixMe[incompatible-type] automated comment
        ref={templateMaintenanceInstance}
        onClose={closeHandler}
        mode={maintenanceDialogOpenMode}
        currentTemplate={currentTemplate}
        onAddTemplate={addTemplateHandler}
        onUpdateTemplate={updateTemplateHandler}
        onDeleteTemplate={deleteTemplateHandler}
      />
    </>
  );
};

export const ListViewConfigMenuContent: ComponentType<$Diff<Props, CssClasses>> = withStyles(
  getStyles,
)(ListViewConfigMenuContentPlain);
