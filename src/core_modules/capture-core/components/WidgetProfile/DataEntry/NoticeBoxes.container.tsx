import React from 'react';
import { NoticeBox } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

type NoticeBoxesProps = {
    errorsMessages?: Array<{ id: string; message: string }>;
    warningsMessages?: Array<{ id: string; message: string }>;
    hasApiError?: boolean;
    dataEntryId?: string;
    itemId?: string;
    saveAttempted?: boolean;
};

export const NoticeBoxes = ({
    errorsMessages = [],
    warningsMessages = [],
    hasApiError = false,
}: NoticeBoxesProps) => (
    <>
        <br />
        {errorsMessages && errorsMessages.length > 0 && (
            <NoticeBox title={i18n.t('There is a problem with this form') as string} error>
                <ul>
                    {errorsMessages?.map(error => (
                        <li key={error.id}> {error.message} </li>
                    ))}
                </ul>
            </NoticeBox>
        )}
        <br />
        {warningsMessages && warningsMessages.length > 0 && (
            <NoticeBox title={i18n.t('There are warnings in this form') as string} warning>
                <ul>
                    {warningsMessages?.map(warning => (
                        <li key={warning.id}> {warning.message} </li>
                    ))}
                </ul>
            </NoticeBox>
        )}
        <br />
        {hasApiError && (
            <NoticeBox title={i18n.t('There was a problem saving changes') as string} error>
                {i18n.t('Try again or contact your system administrator for support') as string}
            </NoticeBox>
        )}
        <br />
    </>
);
