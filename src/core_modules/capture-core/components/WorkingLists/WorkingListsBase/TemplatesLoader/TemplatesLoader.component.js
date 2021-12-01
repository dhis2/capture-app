// @flow
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import { TemplatesManager } from '../TemplatesManager';
import type { Props } from './templatesLoader.types';

const TemplatesManangerWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(TemplatesManager));

const useLoadTemplates = ({
    programId,
    loadedProgramIdForTemplates,
    dirtyTemplates,
    onLoadTemplates,
    onCancelLoadTemplates,
}) => {
    const firstRunRef = useRef(true);
    const triggerLoadRef = useRef(true);

    let triggerLoad = false;
    if (programId !== loadedProgramIdForTemplates ||
        (dirtyTemplates && firstRunRef.current)) {
        triggerLoad = true;
    }
    triggerLoadRef.current = triggerLoad;

    const cancelLoadTemplatesIfApplicable = useCallback(() => {
        triggerLoadRef.current && onCancelLoadTemplates && onCancelLoadTemplates();
    }, [onCancelLoadTemplates]);

    useEffect(() => {
        firstRunRef.current = false;

        if (triggerLoad) {
            onLoadTemplates(programId);
        }

        return () => cancelLoadTemplatesIfApplicable();
    }, [
        triggerLoad,
        onLoadTemplates,
        programId,
        cancelLoadTemplatesIfApplicable,
    ]);

    useEffect(() => () => onCancelLoadTemplates && onCancelLoadTemplates(), [onCancelLoadTemplates]);

    return triggerLoad;
};

export const TemplatesLoader = memo<Props>((props: Props) => {
    const {
        loadTemplatesError,
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        loadedProgramIdForTemplates,
        dirtyTemplates,
        templatesLoading,
        ...passOnProps
    } = props;

    const triggerLoading = useLoadTemplates({
        programId,
        loadedProgramIdForTemplates,
        dirtyTemplates,
        onLoadTemplates,
        onCancelLoadTemplates,
    });

    return (
        <TemplatesManangerWithLoadingIndicator
            {...passOnProps}
            ready={!triggerLoading && !templatesLoading}
            error={loadTemplatesError}
            programId={programId}
        />
    );
});
