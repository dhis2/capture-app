import React from 'react';
import { IconDelete16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './delete.types';

export const Delete = ({ enrollment, canCascadeDeleteEnrollment, onDelete }: Props) => (
    <MenuItem
        dense
        dataTest="widget-enrollment-actions-delete"
        onClick={() => onDelete({ ...enrollment, cascadeDeleteEnrollment: canCascadeDeleteEnrollment })}
        icon={<IconDelete16 />}
        destructive
        label={i18n.t('Delete enrollment') as string}
        suffix=""
    />
);
