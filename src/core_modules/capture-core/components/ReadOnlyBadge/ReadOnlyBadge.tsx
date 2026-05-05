import React from 'react';
import { colors, IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

type Props = {
    readOnly: boolean;
    label?: string;
};

export const ReadOnlyBadge = ({ readOnly, label }: Props) => {
    if (!readOnly) return null;
    return (
        <Tag maxWidth="400px" neutral icon={<IconInfo16 color={colors.grey700} />}>
            {label ?? i18n.t('Read only - You can only view this enrollment')}
        </Tag>
    );
};
