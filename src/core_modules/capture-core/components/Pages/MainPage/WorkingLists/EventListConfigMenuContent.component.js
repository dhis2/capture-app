// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import EventListLoader from './EventListLoader.component';
import { TemplateMaintenance, dialogModes } from './TemplateMaintenance';

type PassOnProps = {
    eventsData: ?Object,
    currentPage: ?number,
    rowsPerPage: ?number,
};

type Props = {
    ...PassOnProps,
    listId: string,
    currentTemplate: Object,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    columnOrder: ?Array<Object>,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
    defaultConfig: Map<string, Object>,
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
        ...passOnProps
    } = props;
    const [maintenanceDialogOpenMode, setMaintenanceDialogOpenMode] = React.useState(null);

    const getSaveItem = React.useCallback(() => ({
        key: 'save',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.REPLACE);
        },
        element: (
            <div>
                {i18n.t('Save template...')}
            </div>
        ),
    }), [
        setMaintenanceDialogOpenMode,
    ]);

    const getDeleteItem = React.useCallback(() => ({
        key: 'delete',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.DELETE);
        },
        element: (
            <div>
                {i18n.t('Delete template...')}
            </div>
        ),
    }), [
        setMaintenanceDialogOpenMode,
    ]);

    const customMenuContents = React.useMemo(() => {
        const menuContents = [];

        if (!currentTemplate.isDefault && !currentTemplate.notPreserved) {
            menuContents.push(getSaveItem());
        }

        menuContents.push({
            key: 'saveAs',
            clickHandler: () => {
                setMaintenanceDialogOpenMode(dialogModes.NEW);
            },
            element: (
                <div>
                    {i18n.t('Save template as...')}
                </div>
            ),
        });

        if (!currentTemplate.isDefault && !currentTemplate.notPreserved) {
            menuContents.push(getDeleteItem());
        }

        return menuContents;
    }, [currentTemplate, getSaveItem, getDeleteItem]);

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

export default EventListConfigMenuContent;
