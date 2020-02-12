// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import TemplatesManager from './TemplatesManager.component';

const TemplatesManangerWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(TemplatesManager));

type Props = {
    templates?: ?Object,
    loadTemplatesError: ?string,
    onLoadTemplates: Function,
    listId: string,
};

const TemplatesLoader = (props: Props) => {
    const {
        templates,
        loadTemplatesError,
        onLoadTemplates,
        listId,
        ...passOnProps
    } = props;

    React.useEffect(() => {
        if (!templates) {
            onLoadTemplates(listId);
        }
    }, []);

    const ready = !!templates;

    return (
        <TemplatesManangerWithLoadingIndicator
            {...passOnProps}
            ready={ready}
            templates={templates}
            error={loadTemplatesError}
            listId={listId}
        />
    );
};

export default TemplatesLoader;
