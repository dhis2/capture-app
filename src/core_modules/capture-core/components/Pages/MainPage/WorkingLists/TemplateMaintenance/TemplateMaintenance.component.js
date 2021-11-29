// @flow
import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import ExistingTemplateDialog from './ExistingTemplateDialog.component';
import NewTemplateDialog from './NewTemplateDialog.component';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.component';
import SharingDialog from './SharingDialog.component';
import { dialogModes } from './dialogModes';
import type { SharingSettings } from '../workingLists.types';

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
    onSetSharingSettings: Function,
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
        onSetSharingSettings,
        defaultConfig,
        ...passOnProps
    } = props;

    const handleTemplateHandler = React.useCallback(() => {
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

    const handleUpdateTemplate = useCallback(() => {
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

    const handleDeleteTemplate = useCallback(() => {
        onDeleteTemplate(currentTemplate, listId);
    }, [
        onDeleteTemplate,
        currentTemplate,
        listId,
    ]);

    const handleSetSharingSettings = useCallback((sharingSettings: SharingSettings) => {
        onSetSharingSettings(sharingSettings, currentTemplate.id);
    }, [currentTemplate.id, onSetSharingSettings]);

    useImperativeHandle(ref, () => ({
        handleUpdateTemplate,
    }));

    return (
        <React.Fragment>
            <ExistingTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.REPLACE}
                onSaveTemplate={handleUpdateTemplate}
            />
            <NewTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.NEW}
                onSaveTemplate={handleTemplateHandler}
            />
            <DeleteConfirmationDialog
                {...passOnProps}
                open={mode === dialogModes.DELETE}
                onDeleteTemplate={handleDeleteTemplate}
                templateName={currentTemplate.displayName}
            />
            <SharingDialog
                {...passOnProps}
                open={mode === dialogModes.SHARING}
                templateId={currentTemplate.id}
                onClose={handleSetSharingSettings}
            />
        </React.Fragment>
    );
};

// $FlowFixMe[missing-annot] automated comment
export default forwardRef<Props, { handleUpdateTemplate: Function }>(TemplateMaintenance);
