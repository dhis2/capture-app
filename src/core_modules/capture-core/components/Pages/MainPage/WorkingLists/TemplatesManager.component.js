// @flow
import * as React from 'react';
import EventListConfig from './EventListConfig.component';
import TemplateSelector from './TemplateSelector.component';
import { ManagerContext } from './workingLists.context';
import type { WorkingListTemplate } from './workingLists.types';

type PassOnProps = {|
    defaultConfig: Map<string, Object>,
    eventsData: ?Object,
|};

type Props = {
    templates: Object,
    listId: string,
    ...PassOnProps,
};

const TemplatesManager = (props: Props) => {
    const { templates, listId, ...passOnProps } = props;
    const {
        selectedTemplate,
        onSelectTemplate,
    } = React.useContext(ManagerContext);
    const handleSelectTemplate = (template: WorkingListTemplate) => {
        onSelectTemplate(template.id, listId);
    };

    return (
        <React.Fragment>
            <TemplateSelector
                templates={templates}
                selectedTemplateId={selectedTemplate.id}
                onSelectTemplate={handleSelectTemplate}
            />
            <EventListConfig
                {...passOnProps}
                listId={listId}
                selectedTemplate={selectedTemplate}
            />

        </React.Fragment>
    );
};

export default TemplatesManager;
