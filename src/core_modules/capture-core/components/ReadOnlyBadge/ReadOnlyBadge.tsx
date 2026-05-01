import React from 'react';
import { colors, IconInfo16, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

export const ReadOnlyBadge = () => (
    <Tag maxWidth="400px" neutral icon={<IconInfo16 color={colors.grey700} />}>
        {i18n.t('Read only - You can only view this enrollment')}
    </Tag>
);
