// @flow
import * as React from 'react';
import ExistingTemplateDialog from './ExistingTemplateDialog.component';
import NewTemplateDialog from './NewTemplateDialog.component';
import { dialogModes } from './dialogModes';

type PassOnProps = {
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onClose: Function,
};

type Props = {
    ...PassOnProps,
    mode: ?$Values<typeof dialogModes>,
};

const TemplateSaver = (props: Props) => {
    const { mode, onAddTemplate, onUpdateTemplate, ...passOnProps } = props;

    return (
        <React.Fragment>
            <ExistingTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.REPLACE}
                onSaveTemplate={onUpdateTemplate}
            />
            <NewTemplateDialog
                {...passOnProps}
                open={mode === dialogModes.NEW}
                onSaveTemplate={onAddTemplate}
            />
        </React.Fragment>
    );
};

export default TemplateSaver;
