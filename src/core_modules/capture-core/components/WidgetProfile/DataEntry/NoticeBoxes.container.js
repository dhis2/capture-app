// @flow
import React from 'react';
import uuid from 'uuid/v4';
import { NoticeBox } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';

const prepareMessages = (rulesEffectsGeneral, rulesEffectsMessages, onComplete, type) => {
    let messages = rulesEffectsGeneral && rulesEffectsGeneral[type] ? rulesEffectsGeneral[type] : [];
    if (onComplete) {
        messages =
            rulesEffectsGeneral && rulesEffectsGeneral[`${type}OnComplete`]
                ? [...messages, ...rulesEffectsGeneral[`${type}OnComplete`]]
                : messages;

        messages =
            rulesEffectsMessages &&
            Object.values(rulesEffectsMessages).reduce(
                (acc, rulesEffectsMessage: any) =>
                    (acc = rulesEffectsMessage[`${type}OnComplete`]
                        ? [...acc, { message: rulesEffectsMessage[`${type}OnComplete`], id: uuid() }]
                        : acc),
                messages,
            );
    }
    return messages;
};

export const NoticeBoxes = ({
    dataEntryId,
    itemId,
    onComplete,
}: {
    dataEntryId: string,
    itemId: string,
    onComplete: boolean,
}) => {
    const ruleId = `${dataEntryId}-${itemId}`;
    const { rulesEffectsGeneralErrors, rulesEffectsGeneralWarnings, rulesEffectsMessages } = useSelector(store => ({
        rulesEffectsGeneralErrors: store.rulesEffectsGeneralErrors && store.rulesEffectsGeneralErrors[ruleId],
        rulesEffectsGeneralWarnings: store.rulesEffectsGeneralWarnings && store.rulesEffectsGeneralWarnings[ruleId],
        rulesEffectsMessages: store.rulesEffectsMessages && store.rulesEffectsMessages[ruleId],
    }));
    const errors = prepareMessages(rulesEffectsGeneralErrors, rulesEffectsMessages, onComplete, 'error');
    const warnings = prepareMessages(rulesEffectsGeneralWarnings, rulesEffectsMessages, onComplete, 'warning');

    return (
        <>
            <br />
            {errors && errors.length > 0 && (
                <NoticeBox title={i18n.t('There are errors in this form')} error>
                    <ul>
                        {errors.map(error => (
                            <li key={error.id}> {error.message} </li>
                        ))}
                    </ul>
                </NoticeBox>
            )}
            <br />
            {warnings && warnings.length > 0 && (
                <NoticeBox title={i18n.t('There are warnings in this form')} warning>
                    <ul>
                        {warnings.map(warning => (
                            <li key={warning.id}> {warning.message} </li>
                        ))}
                    </ul>
                </NoticeBox>
            )}
            <br />
        </>
    );
};
