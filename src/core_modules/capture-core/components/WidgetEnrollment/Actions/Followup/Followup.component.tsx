import React from 'react';
import { IconFlag16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useProgramLabel } from '../../../../metaData';
import type { Props } from './followup.types';

export const Followup = ({ enrollment, onUpdate }: Props) => {
    const followUp = useProgramLabel('followUp') ?? i18n.t('follow-up');

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
            label={i18n.t('Remove mark for {{followUp}}', {
                followUp,
                interpolation: { escapeValue: false },
            })}
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
            label={i18n.t('Mark for {{followUp}}', {
                followUp,
                interpolation: { escapeValue: false },
            })}
            suffix=""
        />
    );
};
