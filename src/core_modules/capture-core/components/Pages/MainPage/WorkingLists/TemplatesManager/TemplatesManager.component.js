// @flow
import React, { type ComponentType } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListViewConfig } from '../ListViewConfig';
import TemplateSelector from '../TemplateSelector.component';
import { ManagerContext } from '../workingLists.context';
import { withBorder } from '../borderHOC';
import type {
    WorkingListTemplate,
} from '../workingLists.types';
import type { Props } from './templatesManager.types';

const TemplatesManagerPlain = (props: Props) => {
    const { templates, ...passOnProps } = props;
    const {
        currentTemplate,
        onSelectTemplate,
    } = React.useContext(ManagerContext);

    if (!templates || !currentTemplate) {
        log.error(
            errorCreator('Templates and currentTemplate needs to be set during templates loading')(
                { templates, currentTemplate }));
        throw Error('Templates and currentTemplate needs to be set during templates loading. See console for details');
    }

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

export const TemplatesManager: ComponentType<Props> = withBorder()(TemplatesManagerPlain);
