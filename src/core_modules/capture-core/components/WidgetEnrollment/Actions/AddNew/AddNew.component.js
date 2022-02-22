// @flow
import { IconAdd16, MenuItem, Tooltip } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './addNew.types';
import { plainStatus } from '../../constants/status.const';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../metaData';

const AddNewItem = ({ onClick, ...passOnProps }: Object) => (<MenuItem
    dense
    dataTest="widget-enrollment-actions-add-new"
    onClick={onClick}
    icon={<IconAdd16 />}
    label={i18n.t('Add new')}
    {...passOnProps}
/>);

export const AddNew = ({ enrollment, onlyEnrollOnce, tetId, onAddNew }: Props) => {
    const isCompleted = enrollment.status === plainStatus.COMPLETED;
    if (!isCompleted) {
        return null;
    }
    const tetName = tetId ? getTrackedEntityTypeThrowIfNotFound(tetId)?.name : '';

    return (onlyEnrollOnce ? <Tooltip
        content={i18n.t('Only one enrollment per {{tetName}} is allowed in this program', { tetName })}
    >
        <AddNewItem
            disabled={onlyEnrollOnce}
            onClick={onAddNew}
        />
    </Tooltip> : <AddNewItem onClick={onAddNew} />);
};
