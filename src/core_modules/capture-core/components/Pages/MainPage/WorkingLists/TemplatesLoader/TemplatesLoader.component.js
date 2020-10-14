// @flow
import React, { memo } from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../../HOC';
import { TemplatesManager } from '../TemplatesManager';
import type { Props } from './templatesLoader.types';

const TemplatesManangerWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(TemplatesManager));

export const TemplatesLoader = memo<Props>((props: Props) => {
    const {
        loadTemplatesError,
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        loadedContext,
        dirtyTemplates,
        templatesLoading,
        ...passOnProps
    } = props;

    const firstRunRef = React.useRef(true);

    React.useEffect(() => {
        if (programId === loadedContext.programIdTemplates &&
            (!dirtyTemplates || !firstRunRef.current)) {
            firstRunRef.current = false;
            return undefined;
        }
        firstRunRef.current = false;
        onLoadTemplates(programId);
        return undefined;
    }, [
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        loadedContext.programIdTemplates,
        dirtyTemplates,
    ]);

    React.useEffect(() => () => onCancelLoadTemplates && onCancelLoadTemplates(), [onCancelLoadTemplates]);

    const ready = programId === loadedContext.programIdTemplates &&
        (!dirtyTemplates || !firstRunRef.current) &&
        !templatesLoading;

    return (
        <TemplatesManangerWithLoadingIndicator
            {...passOnProps}
            ready={ready}
            error={loadTemplatesError}
            programId={programId}
            loadedContext={loadedContext}
        />
    );
});
