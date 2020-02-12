// @flow
import * as React from 'react';
import EventListLoader from './EventListLoader.component';
import TemplateSelector from './TemplateSelector.component';
import { ManagerContext } from './workingLists.context';
import type { WorkingListTemplate } from './workingLists.types';

type PassOnProps = {|
    listId: string,
|};

type Props = {
    templates: Object,
    ...PassOnProps,
};

const TemplatesManager = (props: Props) => {
    const { templates, ...passOnProps } = props;
    const {
        selectedTemplate,
        onSelectTemplate,
    } = React.useContext(ManagerContext);
    const handleSelectTemplate = (template: WorkingListTemplate) => {
        var x = onSelectTemplate;
    };



    return (
        <React.Fragment>
            <TemplateSelector
                templates={templates}
                selectedTemplateId={selectedTemplate.id}
                onSelectTemplate={handleSelectTemplate}
            />
            <EventListLoader
                {...passOnProps}
                selectedTemplate={selectedTemplate}
            />

        </React.Fragment>
    );
};

export default TemplatesManager;
