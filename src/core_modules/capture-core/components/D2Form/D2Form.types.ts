import * as React from 'react';
import type { RenderFoundation } from '../../metaData';

export type FormRef = {
    readonly formRef?: (instance: any) => void;
};

export type OwnProps = {
    readonly formFoundation: RenderFoundation;
    readonly id: string;
    readonly formHorizontal?: boolean;
    readonly getCustomContent?: (beforeSectionId: string) => React.ReactNode;
    readonly validationAttempted?: boolean;
    readonly onUpdateField?: (...args: any[]) => void;
    readonly onUpdateFieldAsync?: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: (...callbackArgs: any[]) => void
    ) => void;
} & FormRef;

export type PropsFromRedux = {
    readonly isFormInReduxStore?: boolean;
};

export type Props = OwnProps & PropsFromRedux;

export type PropsForPureComponent = Omit<Props, keyof FormRef> & {
    readonly formRef?: (instance: any) => void;
};

type RulesHiddenFields = {
    [id: string]: boolean;
};

type RulesCompulsoryFields = { [id: string]: boolean };
type RulesCompulsoryErrors = { [id: string]: string };
type RulesDisabledFields = { [id: string]: boolean };

type RulesMessage = {
    error?: string | null;
    warning?: string | null;
    errorOnComplete?: string | null;
    warningOnComplete?: string | null;
};
type RulesMessages = {
    [id: string]: RulesMessage | null;
};

export type RuleEffects = {
    messages: RulesMessages;
    hiddenFields: RulesHiddenFields;
    compulsoryFields: RulesCompulsoryFields;
    compulsoryErrors: RulesCompulsoryErrors;
    disabledFields: RulesDisabledFields;
};
