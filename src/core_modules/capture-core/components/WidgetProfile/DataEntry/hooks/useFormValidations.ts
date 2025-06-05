import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import type { ValidationMessages, ValidationResult } from './hooks.types';

const prepareMessages = (
    rulesEffectsGeneral: any,
    rulesEffectsMessages: any,
    saveAttempted: boolean,
    type: string
): ValidationMessages => {
    let messages = rulesEffectsGeneral && rulesEffectsGeneral[type] ? rulesEffectsGeneral[type] : [];
    if (saveAttempted) {
        messages = rulesEffectsGeneral[`${type}OnComplete`] 
            ? [...messages, ...rulesEffectsGeneral[`${type}OnComplete`]] 
            : messages;

        messages = Object.values(rulesEffectsMessages).reduce(
            (acc: ValidationMessages, rulesEffectsMessage: any) =>
                (rulesEffectsMessage[`${type}OnComplete`] 
                    ? [...acc, { message: rulesEffectsMessage[`${type}OnComplete`], id: uuid() }] 
                    : acc),
            messages,
        );
    }
    return messages;
};

export const useFormValidations = (dataEntryId: string, itemId: string, saveAttempted: boolean): ValidationResult => {
    const ruleId = `${dataEntryId}-${itemId}`;
    const {
        rulesEffectsGeneralErrors = {},
        rulesEffectsGeneralWarnings = {},
        rulesEffectsMessages = {},
        formsSectionsFieldsUI = {},
    } = useSelector((store: any) => ({
        rulesEffectsGeneralErrors: store.rulesEffectsGeneralErrors && store.rulesEffectsGeneralErrors[ruleId],
        rulesEffectsGeneralWarnings: store.rulesEffectsGeneralWarnings && store.rulesEffectsGeneralWarnings[ruleId],
        rulesEffectsMessages: store.rulesEffectsMessages && store.rulesEffectsMessages[ruleId],
        formsSectionsFieldsUI: store.formsSectionsFieldsUI && store.formsSectionsFieldsUI[ruleId],
    }));

    const fieldsValidated = useMemo(() => 
        Object.values(formsSectionsFieldsUI).every(({ valid }: any) => valid === true), [formsSectionsFieldsUI]);
    const rulesValidated = useMemo(
        () =>
            Object.values(rulesEffectsMessages).every(({ error, errorOnComplete }: any) => !error && !errorOnComplete) &&
            !rulesEffectsGeneralErrors.errors &&
            !rulesEffectsGeneralErrors.errorOnComplete,
        [rulesEffectsMessages, rulesEffectsGeneralErrors],
    );
    const formValidated = fieldsValidated && rulesValidated;

    let errorsMessages = saveAttempted && !formValidated 
        ? [{ id: uuid(), message: i18n.t('Fix errors in the form to continue.') }] 
        : [];
    errorsMessages = [...errorsMessages, ...prepareMessages(rulesEffectsGeneralErrors, rulesEffectsMessages, saveAttempted, 'error')];
    const warningsMessages = prepareMessages(rulesEffectsGeneralWarnings, rulesEffectsMessages, saveAttempted, 'warning');

    return { errorsMessages, warningsMessages, formValidated };
};
