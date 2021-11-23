// @flow
import React, { useState, useRef, useCallback, useMemo } from 'react';
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
    onSetTemplateSharingSettings: Function,
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
        onSetTemplateSharingSettings,
        defaultConfig,
        currentListIsModified,
        classes,
        ...passOnProps
    } = props;
    const [maintenanceDialogOpenMode, setMaintenanceDialogOpenMode] = useState(null);
    const templateMaintenanceInstance = useRef(null);

    const handleClose = useCallback(() => {
        setMaintenanceDialogOpenMode(null);
    }, []);

    const handleUpdateTemplate = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onUpdateTemplate(...args);
    }, [onUpdateTemplate]);

    const handleAddTemplate = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onAddTemplate(...args);
    }, [onAddTemplate]);

    const handleDeleteTemplate = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onDeleteTemplate(...args);
    }, [onDeleteTemplate]);

    const handleSetSharingSettings = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onSetTemplateSharingSettings && onSetTemplateSharingSettings(...args, listId);
    }, [onSetTemplateSharingSettings, listId]);

    const getSaveItem = useCallback(() => ({
        key: 'save',
        clickHandler: () => {
            // $FlowFixMe[incompatible-use] automated comment
            templateMaintenanceInstance.current.handleUpdateTemplate();
        },
        element: i18n.t('Update view'),
    }), []);

    const getSaveAsItem = useCallback((isDefaultView: boolean, isModified: boolean) => {
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

    const getDeleteItem = useCallback(() => ({
        key: 'delete',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.DELETE);
        },
        element: (
            <div className={classes.delete}>
                {i18n.t('Delete view')}
            </div>
        ),
    }), [
        classes.delete,
    ]);

    const getShareItem = useCallback(() => ({
        key: 'share',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.SHARING);
        },
        element: i18n.t('Share view...'),
    }), []);

    const getSavedViewSubHeader = useCallback((viewName: string) => ({
        key: 'savedViewSubHeader',
        subHeader: viewName.length > 30 ? `${viewName.substring(0, 27)}...` : viewName,
    }), []);

    // eslint-disable-next-line complexity
    const customMenuContents = useMemo(() => {
        const currentViewContents = [];
        const savedViewContents = [];

        const { access, isDefault, notPreserved, name } = currentTemplate;

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
            savedViewContents.splice(0, 0, getSavedViewSubHeader(name));
        }

        return [
            ...currentViewContents,
            ...savedViewContents,
        ];
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
        <React.Fragment>
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
                ref={templateMaintenanceInstance}
                listId={listId}
                onClose={handleClose}
                mode={maintenanceDialogOpenMode}
                currentTemplate={currentTemplate}
                filters={filters}
                sortById={sortById}
                sortByDirection={sortByDirection}
                columnOrder={columnOrder}
                onAddTemplate={handleAddTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onSetSharingSettings={handleSetSharingSettings}
                defaultConfig={defaultConfig}
            />
        </React.Fragment>
    );
};

export default withStyles(getStyles)(EventListConfigMenuContent);
