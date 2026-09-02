import React from 'react';
import { IconFlag16, MenuItem } from '@dhis2/ui';
import type { Props } from './followup.types';
import { useTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';

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
            label={customTerms.i18n.t('Remove mark for {{followUpLabel}}', { followUpLabel })}
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
            label={customTerms.i18n.t('Mark for {{followUpLabel}}', { followUpLabel })}
            suffix=""
        />
    );
};
