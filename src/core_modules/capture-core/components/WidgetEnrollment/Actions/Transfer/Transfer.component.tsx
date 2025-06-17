import React from 'react';
import { IconArrowRight16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './transfer.types';

export const Transfer = ({ setOpenTransfer }: Props) => (
    <MenuItem
        dense
        dataTest="widget-enrollment-actions-transfer"
        onClick={setOpenTransfer}
        icon={<IconArrowRight16 />}
        label={i18n.t('Transfer') as string}
        suffix=""
    />
);
