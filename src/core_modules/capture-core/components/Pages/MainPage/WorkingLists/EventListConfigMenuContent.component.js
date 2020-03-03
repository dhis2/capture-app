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

    const updateTemplateHandler = React.useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onUpdateTemplate(...args);
    }, [onUpdateTemplate]);

    const addTemplateHandler = React.useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onAddTemplate(...args);
    }, [onAddTemplate]);

    const deleteTemplateHandler = React.useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onDeleteTemplate(...args);
    }, [onDeleteTemplate]);

    const getSaveItem = React.useCallback((viewName: string) => ({
        key: 'save',
        clickHandler: () => {
            templateMaintenanceInstance.current.updateTemplateHandler();
        },
        element: (
            <div>
                {i18n.t('Update view: {{viewName}}', { viewName })}
            </div>
        ),
    }), []);

    const getSaveAsItem = React.useCallback((isDefaultView: boolean, isModified: boolean) => {
        if (isDefaultView && !isModified) {
            return {
                key: 'saveAs',
                element: (
                    <div>
                        {i18n.t('Save current view...')}
                    </div>
                ),
            };
        }

        return {
            key: 'saveAs',
            clickHandler: () => {
                setMaintenanceDialogOpenMode(dialogModes.NEW);
            },
            element: (
                <div>
                    {isDefaultView ? i18n.t('Save current view...') : i18n.t('Save current view as...')}
                </div>
            ),
        };
    }, []);

    const getDeleteItem = React.useCallback((viewName: string) => ({
        key: 'delete',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.DELETE);
        },
        element: (
            <div className={classes.delete}>
                {i18n.t('Delete view: {{viewName}}', { viewName })}
            </div>
        ),
    }), [
        classes.delete,
    ]);

    const getShareItem = React.useCallback((viewName: string) => ({
        key: 'share',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.SHARING);
        },
        element: (
            <div>
                {i18n.t('Share view: {{viewName}}', { viewName })}
            </div>
        ),
    }), []);

    // eslint-disable-next-line complexity
    const customMenuContents = React.useMemo(() => {
        const menuContents = [];
        const { access, isDefault, notPreserved, displayName } = currentTemplate;

        menuContents.push(getSaveAsItem(!!isDefault, currentListIsModified));

        if (!isDefault && !notPreserved && access.write && access.update && currentListIsModified) {
            menuContents.push(getSaveItem(displayName));
        }

        if (!isDefault && !notPreserved && access.manage) {
            menuContents.push(getShareItem(displayName));
        }

        if (!isDefault && !notPreserved && access.delete) {
            menuContents.push(getDeleteItem(displayName));
        }

        return menuContents;
    }, [currentTemplate, getSaveItem, getSaveAsItem, getDeleteItem, getShareItem, currentListIsModified]);

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
        </React.Fragment>
    );
};

export default withStyles(getStyles)(EventListConfigMenuContent);
