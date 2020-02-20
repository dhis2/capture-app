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
    onCancelLoadTemplates: Function,
    listId: string,
};

const TemplatesLoader = (props: Props) => {
    const {
        templates,
        loadTemplatesError,
        onLoadTemplates,
        onCancelLoadTemplates,
        listId,
        ...passOnProps
    } = props;

    React.useEffect(() => {
        if (templates !== undefined) {
            return undefined;
        }
        onLoadTemplates(listId);
        return () => onCancelLoadTemplates(listId);
    }, [
        onLoadTemplates,
        onCancelLoadTemplates,
        templates,
        listId,
    ]);

    const ready = templates !== undefined;

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
