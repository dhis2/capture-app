import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { IconFlag16, MenuItem } from '@dhis2/ui';
import type { Props } from './followup.types';
import { getTermLabelFromProgram, LabelKeys } from '../../../../metaData';

export const Followup = ({ enrollment, program, onUpdate }: Props) => {
    const { followUpLabel } = getTermLabelFromProgram([LabelKeys.followUpSingular], { program });
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
