// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox } from '@dhis2/ui';
import type { Props } from './ErrorText.types';

export const ErrorText = ({ stageName }: Props) => (
    <>
        <br />
        <NoticeBox error>
            <span>
                {i18n.t('You can’t add any more {{ programStageName }} events', {
                    programStageName: stageName,
                    interpolation: { escapeValue: false },
                })}
            </span>
        </NoticeBox>
        <br />
    </>
);
