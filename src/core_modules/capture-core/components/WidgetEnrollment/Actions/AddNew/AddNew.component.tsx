import React from 'react';
import { IconAdd16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { useTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';
import type { Props } from './addNew.types';

export const AddNew = ({ tetName, canAddNew, onlyEnrollOnce, onAddNew }: Props) => {
    const enrollmentLabel = useTermLabel('enrollment');

    if (!canAddNew) {
        return null;
    }

    return (
        <ConditionalTooltip
            content={customTerms.i18n.t(
                'Only one {{enrollmentLabel}} per {{tetName}} is allowed in this program',
                { enrollmentLabel, tetName },
            )}
            enabled={onlyEnrollOnce}
        >
            <MenuItem
                dense
                dataTest="widget-enrollment-actions-add-new"
                onClick={onAddNew}
                icon={<IconAdd16 />}
                label={i18n.t('Add new')}
                disabled={onlyEnrollOnce}
                suffix=""
            />
        </ConditionalTooltip>);
};
