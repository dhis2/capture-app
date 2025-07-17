import type { RenderFoundation } from '../../../metaData';

export type Props = {
    formFoundation: RenderFoundation;
    itemId: string;
    onSave: (itemId: string, id: string, formFoundation: RenderFoundation, saveType?: string | null) => void;
    onSaveValidationFailed: (itemId: string, id: string) => void;
    onSaveAbort: (itemId: string, id: string) => void;
    saveAttempted?: boolean | null;
    id: string;
    warnings?: Array<any> | null;
    errors?: Array<any> | null;
    hasGeneralErrors?: boolean | null;
    inProgressList: Array<string>;
    calculatedFoundation: RenderFoundation;
    sectionsInitialised: boolean;
};

export type IsCompletingFn = (props: Props) => boolean;
export type FilterPropsFn = (props: Record<string, any>) => Record<string, any>;
export type GetFormFoundationFn = (props: Record<string, any>) => RenderFoundation;

export type State = {
    messagesDialogOpen: boolean;
    waitForPromisesDialogOpen: boolean;
    waitForFieldValidations: boolean;
    saveType?: string | null;
};

export type WithSaveHandlerOptions = {
    onIsCompleting?: IsCompletingFn;
    onFilterProps?: FilterPropsFn;
    onGetFormFoundation?: GetFormFoundationFn;
};
