import React from 'react';
import { IconFlag16, MenuItem } from '@dhis2/ui';
import type { Props } from './followup.types';
import { useTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';

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
            label={tCustomTerm('Remove mark for {{followUpLabel}}', { followUpLabel })}
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
            label={tCustomTerm('Mark for {{followUpLabel}}', { followUpLabel })}
            suffix=""
        />
    );
};
