// @flow
import * as React from 'react';
import { ListViewConfig } from './ListViewConfig.component';
import TemplateSelector from './TemplateSelector.component';
import { ManagerContext } from './workingLists.context';
import { withBorder } from './borderHOC';
import type {
    WorkingListTemplates,
    WorkingListTemplate,
} from './workingLists.types';

type PassOnProps = {
    programId: string,
};

type Props = {
    ...PassOnProps,
    templates: WorkingListTemplates,
};

const TemplatesManager = (props: Props) => {
    const { templates, ...passOnProps } = props;
    const {
        currentTemplate,
        onSelectTemplate,
    } = React.useContext(ManagerContext);

    const handleSelectTemplate = React.useCallback((template: WorkingListTemplate) => {
        if (template.id === currentTemplate.id) {
            const defaultTemplate = templates.find(t => t.isDefault);
            // $FlowFixMe
            onSelectTemplate(defaultTemplate.id);
            return;
        }
        onSelectTemplate(template.id);
    }, [
        onSelectTemplate,
        currentTemplate.id,
        templates,
    ]);

    return (
        <ListViewConfig
            {...passOnProps}
            currentTemplate={currentTemplate}
        >
            {
                currentListIsModified => (
                    <TemplateSelector
                        templates={templates}
                        currentTemplateId={currentTemplate.id}
                        currentListIsModified={currentListIsModified}
                        onSelectTemplate={handleSelectTemplate}
                    />
                )
            }
        </ListViewConfig>
    );
};

export default withBorder()(TemplatesManager);
