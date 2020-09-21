// @flow
import React, { memo } from 'react';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../HOC';
import TemplatesManager from './TemplatesManager.component';

const TemplatesManangerWithLoadingIndicator = withErrorMessageHandler()(
    withLoadingIndicator()(TemplatesManager));

type Props = {
    loadTemplatesError: ?string,
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    programId: string,
    templatesForProgramId: ?string,
    dirtyTemplates: boolean,
    templatesAreLoading: boolean,
};

// eslint-disable-next-line complexity
const TemplatesLoader = memo<Props>((props: Props) => {
    const {
        loadTemplatesError,
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        templatesForProgramId,
        dirtyTemplates,
        templatesAreLoading,
        ...passOnProps
    } = props;

    const firstRunRef = React.useRef(true);
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (programId === templatesForProgramId &&
            (!dirtyTemplates || !firstRunRef.current)) {
            firstRunRef.current = false;
            return undefined;
        }
        firstRunRef.current = false;
        onLoadTemplates(programId);
        return () => onCancelLoadTemplates();
    }, [
        onLoadTemplates,
        onCancelLoadTemplates,
        programId,
        templatesForProgramId,
        dirtyTemplates,
    ]);

    const ready = programId === templatesForProgramId &&
        (!dirtyTemplates || !firstRunRef.current) &&
        !templatesAreLoading;

    return (
        <TemplatesManangerWithLoadingIndicator
            {...passOnProps}
            ready={ready}
            error={loadTemplatesError}
            programId={programId}
        />
    );
});

export default TemplatesLoader;
