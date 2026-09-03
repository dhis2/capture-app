import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { IconFlag16, MenuItem } from '@dhis2/ui';
import type { Props } from './followup.types';
import { useTermLabel } from '../../../../metaData';

export const Followup = ({ enrollment, onUpdate }: Props) => {
    const followUpLabel = useTermLabel('followUp');
    return enrollment.followUp ? (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-followup-remove"
            onClick={() =>
                onUpdate({
                    ...enrollment,
                    followUp: false,
                })
            }
            icon={<IconFlag16 />}
            label={i18n.t('Remove mark for {{followUpLabel}}', { followUpLabel })}
            suffix=""
        />
    ) : (
        <MenuItem
            dense
            dataTest="widget-enrollment-actions-followup-mark"
            onClick={() =>
                onUpdate({
                    ...enrollment,
                    followUp: true,
                })
            }
            icon={<IconFlag16 />}
            label={i18n.t('Mark for {{followUpLabel}}', { followUpLabel })}
            suffix=""
        />
    );
};
