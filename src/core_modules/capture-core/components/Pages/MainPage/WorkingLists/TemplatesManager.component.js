// @flow
import * as React from 'react';
import EventListConfig from './EventListConfig.component';
import TemplateSelector from './TemplateSelector.component';
import { ManagerContext } from './workingLists.context';
import { withBorder } from './borderHOC';
import type {
    WorkingListTemplate,
} from './workingLists.types';

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

    const handleSelectTemplate = React.useCallback((template: WorkingListTemplate) => {
        if (template.id === currentTemplate.id) {
            const defaultTemplate = templates.find(t => t.isDefault);
            // $FlowFixMe
            onSelectTemplate(defaultTemplate.id, listId);
            return;
        }
        onSelectTemplate(template.id, listId);
    }, [
        onSelectTemplate,
        currentTemplate.id,
        listId,
        templates,
    ]);

    return (
        // $FlowFixMe[prop-missing] automated comment
        <EventListConfig
            {...passOnProps}
            listId={listId}
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
        </EventListConfig>
    );
};

export default withBorder()(TemplatesManager);
