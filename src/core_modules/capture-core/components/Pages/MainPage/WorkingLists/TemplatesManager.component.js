// @flow
import * as React from 'react';
import EventListConfig from './EventListConfig.component';
import TemplateSelector from './TemplateSelector.component';
import { ManagerContext } from './workingLists.context';
import { withBorder } from './borderHOC';
import type { WorkingListTemplate } from './workingLists.types';

type PassOnProps = {|
    defaultConfig: Map<string, Object>,
    eventsData: ?Object,
|};

type Props = {
    templates: Array<WorkingListTemplate>,
    listId: string,
    ...PassOnProps,
};

const TemplatesManager = (props: Props) => {
    const { templates, listId, ...passOnProps } = props;
    const {
        currentTemplate,
        onSelectTemplate,
    } = React.useContext(ManagerContext);
    const handleSelectTemplate = (template: WorkingListTemplate) => {
        if (template.id === currentTemplate.id) {
            const defaultTemplate = templates.find(t => t.isDefault);
            // $FlowFixMe
            onSelectTemplate(defaultTemplate.id, listId);
            return;
        }
        onSelectTemplate(template.id, listId);
    };

    return (
        <React.Fragment>
            <TemplateSelector
                templates={templates}
                currentTemplateId={currentTemplate.id}
                onSelectTemplate={handleSelectTemplate}
            />
            <EventListConfig
                {...passOnProps}
                listId={listId}
                currentTemplate={currentTemplate}
            />

        </React.Fragment>
    );
};

export default withBorder()(TemplatesManager);
