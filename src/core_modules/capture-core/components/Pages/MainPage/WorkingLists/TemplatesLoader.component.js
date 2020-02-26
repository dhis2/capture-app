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
    dirtyTemplates: boolean,
    templatesAreLoading: boolean,
};

// eslint-disable-next-line complexity
const TemplatesLoader = (props: Props) => {
    const {
        loadTemplatesError,
        onLoadTemplates,
        onCancelLoadTemplates,
        listId,
        programId,
        templatesForProgramId,
        dirtyTemplates,
        templatesAreLoading,
        ...passOnProps
    } = props;

    const listIdRef = React.useRef(undefined);
    const firstRunRef = React.useRef(true);
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (programId === templatesForProgramId &&
            (listId === listIdRef.current || !listIdRef.current) &&
            (!dirtyTemplates || !firstRunRef.current)) {
            listIdRef.current = listId;
            firstRunRef.current = false;
            return undefined;
        }
        listIdRef.current = listId;
        firstRunRef.current = false;
        onLoadTemplates(programId, listId);
        return () => onCancelLoadTemplates(listId);
    }, [
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        templatesForProgramId,
        listId,
        dirtyTemplates,
    ]);

    const ready = programId === templatesForProgramId &&
        (listId === listIdRef.current || !listIdRef.current) &&
        (!dirtyTemplates || !firstRunRef.current) &&
        !templatesAreLoading;

    debugger;
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
