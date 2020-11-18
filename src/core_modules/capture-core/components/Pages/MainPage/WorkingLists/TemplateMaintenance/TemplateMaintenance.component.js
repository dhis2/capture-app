// @flow
import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import ExistingTemplateDialog from './ExistingTemplateDialog.component';
import NewTemplateDialog from './NewTemplateDialog.component';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.component';
import SharingDialog from './SharingDialog.component';
import { dialogModes } from './dialogModes';
import type { WorkingListTemplate } from '../workingLists.types';

type PassOnProps = {
    onClose: Function,
};

type Props = {
    ...PassOnProps,
    mode: ?$Values<typeof dialogModes>,
    currentTemplate: WorkingListTemplate,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
};

const TemplateMaintenance = (props: Props, ref) => {
    const {
        mode,
        currentTemplate,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        ...passOnProps
    } = props;

    const addTemplateHandler = useCallback((name: string) => {
        onAddTemplate(name, currentTemplate);
    }, [
        onAddTemplate,
        currentTemplate,
    ]);

    const updateTemplateHandler = useCallback(() => {
        onUpdateTemplate(currentTemplate);
    }, [
        onUpdateTemplate,
        currentTemplate,
    ]);

    const deleteTemplateHandler = useCallback(() => {
        onDeleteTemplate(currentTemplate);
    }, [
        onDeleteTemplate,
        currentTemplate,
    ]);

    useImperativeHandle(ref, () => ({
        updateTemplateHandler,
    }));

    return (
        <>
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
                templateName={currentTemplate.name}
            />
            <SharingDialog
                {...passOnProps}
                open={mode === dialogModes.SHARING}
                templateId={currentTemplate.id}
            />
        </>
    );
};

export default forwardRef<Props, { updateTemplateHandler: Function }>(TemplateMaintenance);
