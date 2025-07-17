import React from 'react';
import { validationStrategies } from '../../../../metaData/RenderFoundation/renderFoundation.const';
import { ErrorAndWarningDialog } from './ErrorAndWarningDialog.component';
import { ErrorDialog } from './ErrorDialog.component';
import { WarningDialog } from './WarningDialog.component';

type Props = {
    open: boolean;
    errors?: Array<{key: string, name?: string | null, error: string}> | null;
    warnings?: Array<{key: string, name?: string | null, warning: string}> | null;
    isCompleting: boolean;
    validationStrategy: string;
    onAbort: () => void;
    onSave: () => void;
};

function isSaveAllowedWithErrors(isCompleting: boolean, validationStrategy: typeof validationStrategies[keyof typeof validationStrategies]) {
    if (validationStrategy === validationStrategies.NONE) {
        return true;
    }

    if (validationStrategy === validationStrategies.ON_COMPLETE) {
        return !isCompleting;
    }

    return false;
}

export const MessagesDialogContents = ({
    open,
    errors,
    warnings,
    isCompleting,
    validationStrategy,
    ...passOnProps
}: Props) => {
    if (!open) {
        return null;
    }

    if (warnings && warnings.length > 0 && errors && errors.length > 0) {
        return (
            <ErrorAndWarningDialog
                errors={errors}
                warnings={warnings}
                saveEnabled={isSaveAllowedWithErrors(isCompleting, validationStrategy)}
                {...passOnProps}
            />
        );
    }

    if (errors && errors.length > 0) {
        return (
            <ErrorDialog
                errors={errors}
                saveEnabled={isSaveAllowedWithErrors(isCompleting, validationStrategy)}
                {...passOnProps}
            />
        );
    }

    return (
        <WarningDialog
            warnings={warnings}
            {...passOnProps}
        />
    );
};
