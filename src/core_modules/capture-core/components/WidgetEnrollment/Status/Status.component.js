// @flow
import React from 'react';
import { Tag, spacersNum } from '@dhis2/ui';
import { plainStatus, translatedStatus } from '../constants/status.const';

import type { Props } from './status.types';

export const Status = ({ status = '' }: Props) => (
    <>
        <Tag
            className="status-tag"
            neutral={status === plainStatus.ACTIVE}
            negative={status === plainStatus.CANCELLED}
        >
            {translatedStatus[status] || status}
        </Tag>

        <style jsx>{`
            :global(.status-tag) {
                margin: 0 0 ${spacersNum.dp4}px 0;
            }
        `}</style>
    </>
);
