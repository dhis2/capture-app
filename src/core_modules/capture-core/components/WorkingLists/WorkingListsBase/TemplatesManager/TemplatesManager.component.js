// @flow
import React, { useContext, type ComponentType } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type {
    WorkingListTemplate,
} from '../workingListsBase.types';
import { ManagerContext } from '../workingListsBase.context';
import { TemplateSelector } from '../TemplateSelector.component';
import { ListViewConfig } from '../ListViewConfig';
import { withBorder } from '../borderHOC';
import type { Props } from './templatesManager.types';

const TemplatesManagerPlain = (props: Props) => {
    const { templates, ...passOnProps } = props;

    const {
        currentTemplate,
        onSelectTemplate,
    } = useContext(ManagerContext) || {};

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
