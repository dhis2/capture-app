// @flow
import * as React from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import TemplatesManager from './TemplatesManager.component';

const TemplatesManangerWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(TemplatesManager));

type Props = {
    loadTemplatesError: ?string,
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    listId: string,
    programId: string,
    templatesForProgramId: ?string,
};

const TemplatesLoader = (props: Props) => {
    const {
        loadTemplatesError,
        onLoadTemplates,
        onCancelLoadTemplates,
        listId,
        programId,
        templatesForProgramId,
        ...passOnProps
    } = props;

    const listIdRef = React.useRef(undefined);
    React.useEffect(() => {
        if (programId === templatesForProgramId && (listId === listIdRef.current || !listIdRef.current)) {
            listIdRef.current = listId;
            return undefined;
        }
        listIdRef.current = listId;
        onLoadTemplates(listId);
        return () => onCancelLoadTemplates(listId);
    }, [
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        templatesForProgramId,
        listId,
    ]);

    const ready = programId === templatesForProgramId;

    return (
        <TemplatesManangerWithLoadingIndicator
            {...passOnProps}
            ready={ready}
            error={loadTemplatesError}
            listId={listId}
            programId={programId}
        />
    );
};

export default TemplatesLoader;
