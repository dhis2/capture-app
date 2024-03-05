// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconArrowRight16, MenuItem } from '@dhis2/ui';
import type { Props } from './transfer.types';

export const Transfer = ({ setOpenTransfer }: Props) => (
    <MenuItem
        dense
        dataTest="widget-enrollment-actions-transfer"
        onClick={() => setOpenTransfer(true)}
        icon={<IconArrowRight16 />}
        label={i18n.t('Transfer')}
    />
);
