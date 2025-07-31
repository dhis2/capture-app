import React, { type ComponentType, useCallback, useContext } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListViewConfig } from '../ListViewConfig';
import { TemplateSelector } from '../TemplateSelector.component';
import { ManagerContext } from '../workingListsBase.context';
import { withBorder } from '../borderHOC';
import type { WorkingListTemplate } from '../workingListsBase.types';
import type { Props } from './templatesManager.types';

const TemplatesManagerPlain = (props: Props) => {
    const { templates, selectionInProgress, ...passOnProps } = props;
    const {
        currentTemplate,
        onSelectTemplate,
    } = useContext(ManagerContext) || { currentTemplate: undefined, onSelectTemplate: undefined };

    if (!templates || !currentTemplate) {
        log.error(
            errorCreator('Templates and currentTemplate needs to be set during templates loading')(
                { templates, currentTemplate }));
        throw Error('Templates and currentTemplate needs to be set during templates loading. See console for details');
    }

    const handleSelectTemplate = useCallback((template: WorkingListTemplate) => {
        if (template.id === currentTemplate!.id) {
            const defaultTemplate = templates!.find(t => t.isDefault);
            onSelectTemplate!(defaultTemplate!.id);
            return;
        }
        onSelectTemplate!(template.id);
    }, [
        onSelectTemplate,
        currentTemplate,
        templates,
    ]);

    return (
        <ListViewConfig
            {...passOnProps}
            selectionInProgress={selectionInProgress}
            currentTemplate={currentTemplate}
        >
            {
                currentListIsModified => (
                    <TemplateSelector
                        templates={templates}
                        currentTemplateId={currentTemplate.id}
                        currentListIsModified={currentListIsModified}
                        onSelectTemplate={handleSelectTemplate}
                        selectionInProgress={selectionInProgress}
                    />
                )
            }
        </ListViewConfig>
    );
};

export const TemplatesManager = withBorder()(TemplatesManagerPlain) as ComponentType<Props>;
