// @flow
import React, { useContext, useCallback, type ComponentType } from 'react';
import log from 'loglevel';
import { useHistory } from 'react-router-dom';
import { errorCreator } from 'capture-core-utils';
import { ListViewConfig } from '../ListViewConfig';
import { TemplateSelector } from '../TemplateSelector.component';
import { ManagerContext } from '../workingListsBase.context';
import { withBorder } from '../borderHOC';
import type {
    WorkingListTemplate,
} from '../workingListsBase.types';
import type { Props } from './templatesManager.types';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';

const TemplatesManagerPlain = (props: Props) => {
    const { templates, ...passOnProps } = props;
    const history = useHistory();
    const { orgUnitId, programId, selectedTemplateId } = useLocationQuery();
    const onChangeUrl = useCallback(
        id =>
            selectedTemplateId &&
            history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: id })}`),
        [history, orgUnitId, programId, selectedTemplateId],
    );

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

    const handleSelectTemplate = useCallback((template: WorkingListTemplate) => {
        if (template.id === currentTemplate.id) {
            const defaultTemplate = templates.find(t => t.isDefault);
            // $FlowFixMe
            onSelectTemplate(defaultTemplate.id);
            onChangeUrl(defaultTemplate?.id);
            return;
        }
        onSelectTemplate(template.id);
        onChangeUrl(template.id);
    }, [
        onSelectTemplate,
        currentTemplate.id,
        templates,
        onChangeUrl,
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
