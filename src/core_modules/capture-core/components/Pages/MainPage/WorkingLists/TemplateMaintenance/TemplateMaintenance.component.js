// @flow
import * as React from 'react';
import ExistingTemplateDialog from './ExistingTemplateDialog.component';
import NewTemplateDialog from './NewTemplateDialog.component';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.component';
import SharingDialog from './SharingDialog.component';
import { dialogModes } from './dialogModes';

type PassOnProps = {
    onClose: Function,
};

type Props = {
    ...PassOnProps,
    listId: string,
    mode: ?$Values<typeof dialogModes>,
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

const TemplateMaintenance = (props: Props, ref) => {
    const {
        listId,
        mode,
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

    const addTemplateHandler = React.useCallback((name: string) => {
        onAddTemplate(name, {
            filters,
            sortById,
            sortByDirection,
            columnOrder,
            defaultConfig,
            listId,
            currentTemplate,
        });
    }, [
        onAddTemplate,
        filters,
        sortById,
        sortByDirection,
        columnOrder,
        defaultConfig,
        listId,
        currentTemplate,
    ]);

    const updateTemplateHandler = React.useCallback(() => {
        onUpdateTemplate(currentTemplate, {
            filters,
            sortById,
            sortByDirection,
            columnOrder,
            defaultConfig,
            listId,
        });
    }, [
        onUpdateTemplate,
        currentTemplate,
        filters,
        sortById,
        sortByDirection,
        columnOrder,
        defaultConfig,
        listId,
    ]);

    const deleteTemplateHandler = React.useCallback(() => {
        onDeleteTemplate(currentTemplate, listId);
    }, [
        onDeleteTemplate,
        currentTemplate,
        listId,
    ]);

    React.useImperativeHandle(ref, () => ({
        updateTemplateHandler,
    }));

    return (
        <React.Fragment>
            <ExistingTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.REPLACE}
                onSaveTemplate={updateTemplateHandler}
            />
            <NewTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.NEW}
                onSaveTemplate={addTemplateHandler}
            />
            <DeleteConfirmationDialog
                {...passOnProps}
                open={mode === dialogModes.DELETE}
                onDeleteTemplate={deleteTemplateHandler}
                templateName={currentTemplate.displayName}
            />
            <SharingDialog
                {...passOnProps}
                open={mode === dialogModes.SHARING}
                templateId={currentTemplate.id}
            />
        </React.Fragment>
    );
};

export default React.forwardRef(TemplateMaintenance);
