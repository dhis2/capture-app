// @flow
import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import type { SharingSettings } from '../workingListsBase.types';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog.component';
import { dialogModes } from './dialogModes';
import { ExistingTemplateDialog } from './ExistingTemplateDialog.component';
import { NewTemplateDialog } from './NewTemplateDialog.component';
import { SharingDialog } from './SharingDialog.component';
import type { Props } from './templateMaintenance.types';

const TemplateMaintenancePlain = (props: Props, ref) => {
    const {
        mode,
        currentTemplate,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        onSetSharingSettings,
        ...passOnProps
    } = props;

    const handleUpdateTemplate = useCallback(() => {
        onUpdateTemplate(currentTemplate);
    }, [
        onUpdateTemplate,
        currentTemplate,
    ]);

    const handleDeleteTemplate = useCallback(() => {
        onDeleteTemplate(currentTemplate);
    }, [
        onDeleteTemplate,
        currentTemplate,
    ]);

    const handleSetSharingSettings = useCallback((sharingSettings: SharingSettings) => {
        onSetSharingSettings(sharingSettings, currentTemplate.id);
    }, [onSetSharingSettings, currentTemplate.id]);

    useImperativeHandle(ref, () => ({
        handleUpdateTemplate,
    }));

    return (
        <>
            <ExistingTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.REPLACE}
                onSaveTemplate={handleUpdateTemplate}
            />
            <NewTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.NEW}
                onSaveTemplate={onAddTemplate}
            />
            <DeleteConfirmationDialog
                {...passOnProps}
                open={mode === dialogModes.DELETE}
                onDeleteTemplate={handleDeleteTemplate}
                templateName={currentTemplate.name}
            />
            <SharingDialog
                open={mode === dialogModes.SHARING}
                templateId={currentTemplate.id}
                onClose={handleSetSharingSettings}
            />
        </>
    );
};

export const TemplateMaintenance = forwardRef<Props, { handleUpdateTemplate: Function }>(TemplateMaintenancePlain);
