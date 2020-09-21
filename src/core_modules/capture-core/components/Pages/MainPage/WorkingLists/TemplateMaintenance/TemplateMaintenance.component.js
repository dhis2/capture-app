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
    mode: ?$Values<typeof dialogModes>,
    currentTemplate: Object,
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

    const addTemplateHandler = React.useCallback((name: string) => {
        onAddTemplate(name, currentTemplate);
    }, [
        onAddTemplate,
        currentTemplate,
    ]);

    const updateTemplateHandler = React.useCallback(() => {
        onUpdateTemplate(currentTemplate);
    }, [
        onUpdateTemplate,
        currentTemplate,
    ]);

    const deleteTemplateHandler = React.useCallback(() => {
        onDeleteTemplate(currentTemplate);
    }, [
        onDeleteTemplate,
        currentTemplate,
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

// $FlowFixMe[missing-annot] automated comment
export default React.forwardRef(TemplateMaintenance);
