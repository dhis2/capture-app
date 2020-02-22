// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import EventListLoader from './EventListLoader.component';
import { TemplateMaintenance, dialogModes } from './TemplateMaintenance';
import type { WorkingListTemplate } from './workingLists.types';

type PassOnProps = {
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

    const getSaveItem = React.useCallback(() => ({
        key: 'save',
        clickHandler: () => {
            templateMaintenanceInstance.current.updateTemplateHandler();
        },
        element: (
            <div>
                {i18n.t('Update current template')}
            </div>
        ),
    }), []);

    const getSaveAsItem = React.useCallback(() => ({
        key: 'saveAs',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.NEW);
        },
        element: (
            <div>
                {i18n.t('Save as template...')}
            </div>
        ),
    }), []);

    const getDeleteItem = React.useCallback(() => ({
        key: 'delete',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.DELETE);
        },
        element: (
            <div>
                {i18n.t('Delete current template')}
            </div>
        ),
    }), []);

    const getShareItem = React.useCallback(() => ({
        key: 'share',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.SHARING);
        },
        element: (
            <div>
                {i18n.t('Share current template...')}
            </div>
        ),
    }), []);

    const customMenuContents = React.useMemo(() => {
        const menuContents = [];
        const { access, isDefault, notPreserved } = currentTemplate;

        if (!isDefault && !notPreserved && access.write && access.update && currentListIsModified) {
            menuContents.push(getSaveItem());
        }

        menuContents.push(getSaveAsItem());

        if (!isDefault && !notPreserved && access.manage) {
            menuContents.push(getShareItem());
        }

        if (!isDefault && !notPreserved && access.delete) {
            menuContents.push(getDeleteItem());
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

export default EventListConfigMenuContent;
